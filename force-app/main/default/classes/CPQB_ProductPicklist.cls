global class CPQB_ProductPicklist extends VisualEditor.DynamicPickList{
    
    global override VisualEditor.DataRow getDefaultValue(){
        Product2 p = [SELECT Id, Name, IsActive FROM Product2 WHERE IsActive = true LIMIT 1];
        VisualEditor.DataRow defaultValue =new VisualEditor.DataRow(String.valueOf(p.Name), String.valueOf(p.Id));
        return defaultValue;
    }
    global override VisualEditor.DynamicPickListRows getValues() {
        VisualEditor.DynamicPickListRows myValues = new VisualEditor.DynamicPickListRows();
        List<Product2> prods = [SELECT Id, Name, IsActive FROM Product2 WHERE IsActive = true];
        for(Product2 p: prods) {
            myValues.addRow(new VisualEditor.DataRow(String.valueOf(p.Name), String.valueOf(p.Id)));
        }
        return myValues;
    }
}