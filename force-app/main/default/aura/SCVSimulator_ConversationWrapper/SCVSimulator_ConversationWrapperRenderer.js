({
    afterRender: function (component, helper) {
        this.superAfterRender();
        component.find("focusInput").focus();
        console.log('After Render');
    }
})