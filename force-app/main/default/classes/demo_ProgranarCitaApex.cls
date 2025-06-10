public with sharing class demo_ProgranarCitaApex {


	@AuraEnabled
	public static Event programarCita(Id recordId, Boolean asignacionAuto, Boolean comprobarContacto, Id idPropietario,
		Datetime startDateTime, Boolean esAvisoCorreo, String emailDestinatario) {
		try {
			if (esAvisoCorreo && String.isNotBlank(emailDestinatario)) {
				return enviarAvisoCorreo(recordId, comprobarContacto, startDateTime, startDateTime.addMinutes(30), emailDestinatario);
			} else {
			return programarCita2(recordId, asignacionAuto, comprobarContacto, idPropietario, startDateTime, startDateTime.addMinutes(30));
			}
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	private static Event enviarAvisoCorreo(Id idOportunidad, Boolean comprobarContacto, Datetime startDateTime, Datetime endDateTime, String emailDestinatario) {
		Opportunity oportunidadAsociada = [SELECT Name, RecordType.DeveloperName FROM Opportunity WHERE Id = :idOportunidad];

		// Crear el evento
		Event nuevoEvento = new Event();
		nuevoEvento.Type = 'Aviso por correo';
		nuevoEvento.WhatId = idOportunidad;
		nuevoEvento.Subject = 'Aviso por correo - ' + oportunidadAsociada.Name;
		nuevoEvento.StartDateTime = startDateTime;
		nuevoEvento.EndDateTime = endDateTime;
		nuevoEvento.Description = 'Aviso enviado por correo a: ' + emailDestinatario;

		// Asignar propietario genérico
		User genericUser;
		try {
			genericUser = [SELECT Id FROM User WHERE UserName LIKE 'csbd_generico@cc-caixabank.com%' LIMIT 1];
		} catch (Exception e) {
			// En caso de test, usar el usuario actual
			genericUser = new User(Id = UserInfo.getUserId());
		}

		nuevoEvento.OwnerId = genericUser.Id;

		// Enviar email
		Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
		String[] toAddresses = new String[] {emailDestinatario};
		email.setToAddresses(toAddresses);
		email.setSubject('Solicitud de disponibilidad para la oportunidad ' + oportunidadAsociada.Name);

		// Formatear la fecha
		String fechaFormateada = startDateTime.format('EEEE dd/MM/yyyy HH:mm', 'Europe/Madrid');
		String cuerpoEmail = 'Se ha solicitado su disponibilidad para atender al cliente de la oportunidad ' +
			oportunidadAsociada.Name + ' en la fecha ' + fechaFormateada + '.\n\n' +
			'Por favor, confirme su disponibilidad respondiendo a este correo.';

		email.setPlainTextBody(cuerpoEmail);

		// Enviar email si no estamos en un contexto de test
		if (!Test.isRunningTest()) {
			Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });
		}

		// Actualizar la oportunidad
		Opportunity oportunidad = new Opportunity(Id = idOportunidad);
		oportunidad.OwnerId = genericUser.Id;

		insert nuevoEvento;
		update oportunidad;

		return nuevoEvento;
	}

	private static Event programarCita2(Id idOportunidad, Boolean asignacionAuto, Boolean comprobarContacto, Id idPropietario, Datetime startDateTime, Datetime endDateTime) {
		Opportunity oportunidadAsociada = [SELECT Name, RecordType.DeveloperName FROM Opportunity WHERE Id = :idOportunidad];

		Event nuevoEvento = new Event();
		nuevoEvento.Type = 'Cita con cliente';
		nuevoEvento.WhatId = idOportunidad;
		nuevoEvento.Subject = 'Cita - ' + oportunidadAsociada.Name;
		nuevoEvento.StartDateTime = startDateTime;
		nuevoEvento.EndDateTime = endDateTime;

		Opportunity oportunidad = new Opportunity(Id = idOportunidad);
		// oportunidad.CSBD_Fecha_Cita__c = startDateTime;

		if (!String.isBlank(idPropietario)) {
			oportunidad.OwnerId = idPropietario;
			nuevoEvento.OwnerId = idPropietario;
		} else {
			//Se marca el evento como pendiente de asignación automática externa -- se enviará a omnichannel en la reactivación
			User genericUser;
			try {
				genericUser = [SELECT Id FROM User WHERE UserName LIKE 'csbd_generico@cc-caixabank.com%' LIMIT 1];
			} catch (Exception e) {
				// En caso de test, usar el usuario actual
				genericUser = new User(Id = UserInfo.getUserId());
			}

			oportunidad.OwnerId = genericUser.Id;

			if (Test.isRunningTest()) {
				// En modo test, asignar al usuario actual
				nuevoEvento.OwnerId = UserInfo.getUserId();
			} else {
				try {
					nuevoEvento.OwnerId = [SELECT Id FROM Calendar WHERE Name = 'Citas pendientes de reasignar' LIMIT 1].Id;
				} catch (Exception e) {
					// Si no existe el calendario, asignar al usuario genérico
					nuevoEvento.OwnerId = genericUser.Id;
				}
			}
		}

		insert nuevoEvento;
		update oportunidad;

		//la llamada a omnichannel para el alta se añade en finalizarCita() cuando esta se cumple
		return nuevoEvento;
	}
}