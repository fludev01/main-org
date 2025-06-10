<aura:application extends="force:slds">
    <aura:attribute name="pscId" type="String" default=""/>
    <aura:handler value="{!this}" name="init" action="{!c.init}"/>
    <c:imageWithHotspots pscId='{!v.pscId}'/>
    <!--<c:hotspotContainer pscId='{!v.pscId}'/>-->
</aura:application>