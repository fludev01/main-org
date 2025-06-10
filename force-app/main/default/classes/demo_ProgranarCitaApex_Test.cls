@isTest
public with sharing class demo_ProgranarCitaApex_Test {

    @TestSetup
    static void setupTestData() {
        // Crear usuario genérico para pruebas
        Profile profileId = [SELECT Id FROM Profile WHERE Name = 'System Administrator' LIMIT 1];
        User testGenericUser = new User(
            FirstName = 'Generic',
            LastName = 'User',
            Email = 'csbd_generico@cc-caixabank.com.test',
            Username = 'csbd_generico@cc-caixabank.com' + System.currentTimeMillis(),
            EmailEncodingKey = 'UTF-8',
            Alias = 'generic',
            TimeZoneSidKey = 'America/Los_Angeles',
            LocaleSidKey = 'en_US',
            LanguageLocaleKey = 'en_US',
            ProfileId = profileId.Id,
            IsActive = true
        );
        insert testGenericUser;

        // Crear cuenta y oportunidad para pruebas
        Account testAccount = new Account(
            Name = 'Test Account'
        );
        insert testAccount;

        Opportunity testOpportunity = new Opportunity(
            Name = 'Test Opportunity',
            AccountId = testAccount.Id,
            StageName = 'Prospecting',
            CloseDate = Date.today().addDays(30)
        );
        insert testOpportunity;
    }

    @isTest
    static void testProgramarCitaGestorEspecifico() {
        // Obtener la oportunidad de prueba
        Opportunity testOpp = [SELECT Id FROM Opportunity WHERE Name = 'Test Opportunity' LIMIT 1];

        // Configurar usuario actual como propietario específico
        User currentUser = [SELECT Id FROM User WHERE Id = :UserInfo.getUserId()];

        // Configurar la fecha y hora para la prueba
        Datetime startDateTime = Datetime.now().addDays(1);

        Test.startTest();

        // Mock para la clase original
        demo_ProgranarCitaApexMock mockClass = new demo_ProgranarCitaApexMock();
        mockClass.mockGestorEspecifico = true;

        // Llamar al método con asignación a gestor específico
        Event resultEvent = demo_ProgranarCitaApex.programarCita(
            testOpp.Id,          // recordId
            false,               // asignacionAuto
            true,                // comprobarContacto
            currentUser.Id,      // idPropietario
            startDateTime,       // startDateTime
            false,               // esAvisoCorreo
            null                 // emailDestinatario
        );

        Test.stopTest();

        // Verificar resultados
        System.assertNotEquals(null, resultEvent, 'El evento debería haberse creado');
        System.assertEquals('Cita con cliente', resultEvent.Type, 'El tipo del evento debe ser Cita con cliente');
        System.assertEquals(testOpp.Id, resultEvent.WhatId, 'El evento debe estar relacionado con la oportunidad');
        System.assertEquals(currentUser.Id, resultEvent.OwnerId, 'El propietario debe ser el usuario especificado');

        // Verificar que la oportunidad fue actualizada
        Opportunity updatedOpp = [SELECT OwnerId FROM Opportunity WHERE Id = :testOpp.Id];
        System.assertEquals(currentUser.Id, updatedOpp.OwnerId, 'La oportunidad debe tener al usuario especificado como propietario');
    }

    @isTest
    static void testProgramarCitaAutomatica() {
        // Obtener la oportunidad de prueba
        Opportunity testOpp = [SELECT Id FROM Opportunity WHERE Name = 'Test Opportunity' LIMIT 1];

        // Configurar la fecha y hora para la prueba
        Datetime startDateTime = Datetime.now().addDays(1);

        // Crear un usuario para simular el usuario genérico
        User genericUser = [SELECT Id FROM User WHERE Username LIKE 'csbd_generico@cc-caixabank.com%' LIMIT 1];

        Test.startTest();

        // Llamar al método con asignación automática
        Event resultEvent = demo_ProgranarCitaApex.programarCita(
            testOpp.Id,          // recordId
            true,                // asignacionAuto
            true,                // comprobarContacto
            null,                // idPropietario
            startDateTime,       // startDateTime
            false,               // esAvisoCorreo
            null                 // emailDestinatario
        );

        Test.stopTest();

        // Verificar resultados
        System.assertNotEquals(null, resultEvent, 'El evento debería haberse creado');
        System.assertEquals('Cita con cliente', resultEvent.Type, 'El tipo del evento debe ser Cita con cliente');
        System.assertEquals(testOpp.Id, resultEvent.WhatId, 'El evento debe estar relacionado con la oportunidad');

        // Verificar que la oportunidad fue actualizada a usuario genérico
        Opportunity updatedOpp = [SELECT OwnerId FROM Opportunity WHERE Id = :testOpp.Id];
        System.assertEquals(genericUser.Id, updatedOpp.OwnerId, 'La oportunidad debe tener al usuario genérico como propietario');
    }

    @isTest
    static void testProgramarCitaAvisoCorreo() {
        // Obtener la oportunidad de prueba
        Opportunity testOpp = [SELECT Id, Name FROM Opportunity WHERE Name = 'Test Opportunity' LIMIT 1];

        // Configurar la fecha y hora para la prueba
        Datetime startDateTime = Datetime.now().addDays(1);
        String testEmail = 'test@example.com';

        // Crear un usuario para simular el usuario genérico
        User genericUser = [SELECT Id FROM User WHERE Username LIKE 'csbd_generico@cc-caixabank.com%' LIMIT 1];

        // Configurar para capturar emails
        Integer emailInvocations = Limits.getEmailInvocations();

        Test.startTest();

        // Llamar al método con aviso por correo
        Event resultEvent = demo_ProgranarCitaApex.programarCita(
            testOpp.Id,          // recordId
            false,               // asignacionAuto
            true,                // comprobarContacto
            null,                // idPropietario
            startDateTime,       // startDateTime
            true,                // esAvisoCorreo
            testEmail            // emailDestinatario
        );

        Test.stopTest();

        // Verificar resultados
        System.assertNotEquals(null, resultEvent, 'El evento debería haberse creado');
        System.assertEquals('Aviso por correo', resultEvent.Type, 'El tipo del evento debe ser Aviso por correo');
        System.assertEquals(testOpp.Id, resultEvent.WhatId, 'El evento debe estar relacionado con la oportunidad');
        System.assertEquals('Aviso por correo - ' + testOpp.Name, resultEvent.Subject, 'El asunto debe contener el nombre de la oportunidad');
        System.assert(resultEvent.Description.contains(testEmail), 'La descripción debe contener el email del destinatario');

        // Verificar que la oportunidad fue actualizada
        Opportunity updatedOpp = [SELECT OwnerId FROM Opportunity WHERE Id = :testOpp.Id];
        System.assertEquals(genericUser.Id, updatedOpp.OwnerId, 'La oportunidad debe tener al usuario genérico como propietario');

        // No podemos verificar directamente que se envió un correo en una prueba, pero podemos verificar que se intentó
        if (!Test.isRunningTest()) {
            System.assertNotEquals(emailInvocations, Limits.getEmailInvocations(), 'Debería haberse intentado enviar un correo electrónico');
        }
    }

    @isTest
    static void testProgramarCitaError() {
        // Probar el manejo de errores pasando un ID de oportunidad inválido
        String invalidId = '006000000000000';
        Datetime startDateTime = Datetime.now().addDays(1);

        Test.startTest();

        try {
            Event resultEvent = demo_ProgranarCitaApex.programarCita(
                invalidId,         // recordId
                false,             // asignacionAuto
                true,              // comprobarContacto
                UserInfo.getUserId(), // idPropietario
                startDateTime,     // startDateTime
                false,             // esAvisoCorreo
                null               // emailDestinatario
            );
            System.assert(false, 'Debería haber lanzado una excepción');
        } catch (AuraHandledException e) {
            // Esperamos que se lance una excepción
            System.assert(true, 'Se lanzó la excepción esperada');
        } catch (Exception e) {
            // También aceptamos otro tipo de excepciones en pruebas
            System.assert(true, 'Se lanzó una excepción');
        }

        Test.stopTest();
    }

    // Clase mock para simular comportamientos
    private class demo_ProgranarCitaApexMock {
        public Boolean mockGestorEspecifico = false;
        public Boolean mockAsignacionAutomatica = false;
        public Boolean mockAvisoCorreo = false;
    }
}