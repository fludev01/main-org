import { LightningElement, track, api } from 'lwc';
import TRAILHEAD_LOGO from '@salesforce/resourceUrl/FINS_Banking_Hotspots_Image';

export default class AdminConfiguration extends LightningElement {
  trailheadLogoUrl = TRAILHEAD_LOGO;
  @track hotspots = [];
  @track configList = [];
  @track filteredConfigList = [];
  @track filterSearchTerm;
  @track currentConfig = {};
  @track hotspots = [];
  @track loading = true;
  @track showEmptyHotspotError = false;
  @track hotspotsToDelete = [];

  showChangeFileUpload = false;
  toast_title_success = "Success!";
  toast_variant_success = "success";
  toast_title_error = "Uh Oh! An error occured";
  toast_variant_error = "error";
  isModalOpen = false;
  modalHeader = "";
  modalContent = "";
  modalActionLabel = "";
  styleString;
  curDeletingSpotIdx;
  curDeletingConfigId;
  //pos1 = 0;
  //pos2 = 0;
  posX = 0;
  posY = 0;
  diffX;
  diffY;
  dragElement;

  handleImageClick(event) {
    try {
      let dot_count = this.template.querySelectorAll(".lg-hotspot").length;
      let currentImage = event.currentTarget;
      ////console.log(currentImage);

      ////console.log("currentImage.offsetTop", currentImage.offsetTop);

      let top_offset = currentImage.y - window.pageYOffset;
      let left_offset = currentImage.x - window.pageXOffset;
      ////console.log(top_offset, left_offset);

      let top_px = Math.round(event.clientY - top_offset);
      let left_px = Math.round(event.clientX - left_offset);
      ////console.log(top_px, left_px);

      let top_perc = (top_px / currentImage.height) * 100;
      let left_perc = (left_px / currentImage.width) * 100;

      ////console.log("Top: " + top_px + "px = " + top_perc + "%");
      ////console.log("Left: " + left_px + "px = " + left_perc + "%");
      ////console.log("Left: " + left_perc + "%; Top: " + top_perc + "%;");
      let styleString = "Left: " + left_perc + "%; Top: " + top_perc + "%;";
      this.hotspots.push({ Style_CSS__c: styleString });
      /* //console.log(
        "this.hotspots",
        this.hotspots,
        "this.hotspots.length",
        this.hotspots.length
      ); */
      //this.expandSection(this.hotspots.length - 1);
    } catch (err) {
      //console.log(err);
    }
  }

  dragMouseDown(event) {
    ////console.log("dragMouseDown");
    event.preventDefault();
    ////console.log("dragMouseDown eventdefaule");
    this.posX = event.clientX;
    this.posY = event.clientY;
    ////console.log("posX", this.posX, "posY", this.posY);
    this.dragElement = event.currentTarget;
    this.diffX = this.posX - event.currentTarget.offsetLeft;
    this.diffY = this.posY - event.currentTarget.offsetTop;
    document.onmouseup = this.closeDragElement.bind(this);
    document.onmousemove = this.elementDrag.bind(this);
  }

  elementDrag(event) {
    try {
      //console.log("elementDrag");
      event.preventDefault();
      let container = this.template.querySelector(".lg-container");
      let container_width = container.offsetWidth;
      let container_height = container.offsetHeight;
      let elmnt = this.dragElement;
      let elmnt_width = elmnt.offsetWidth;
      let elmnt_height = elmnt.offsetHeight;

      this.posX = event.clientX;
      this.posY = event.clientY;

      ////console.log("this.dragElement", this.pos2);
      let newPos_X = this.posX - this.diffX;
      let newPos_Y = this.posY - this.diffY;

      ////console.log({ newPos_X, newPos_Y });

      if (newPos_X < 0) newPos_X = 0;
      if (newPos_Y < 0) newPos_Y = 0;
      if (newPos_X + elmnt_width > container_width)
        newPos_X = container_width - elmnt_width;
      if (newPos_Y + elmnt_height > container_height)
        newPos_Y = container_height - elmnt_height;

      elmnt.style.top = newPos_Y + "px";
      elmnt.style.left = newPos_X + "px";
    } catch (error) {
      console.log(error);
    }
  }

  closeDragElement() {
    //console.log("closeDragElement");
    document.onmouseup = null;
    document.onmousemove = null;
    if (this.dragElement.style.top.endsWith("px")) {
      let container = this.template.querySelector(".lg-container");
      let new_left_perc =
        parseInt(this.dragElement.style.left) / (container.offsetWidth / 100);
      let new_top_perc =
        parseInt(this.dragElement.style.top) / (container.offsetHeight / 100);
      //console.log(JSON.stringify(this.hotspots));
      //console.log("new_left_perc", new_left_perc, "new_top_perc", new_top_perc);
      this.dragElement.style.top = `${new_top_perc}%`;
      this.dragElement.style.left = `${new_left_perc}%`;
      this.hotspots[
        this.dragElement.dataset.idx
      ].Style_CSS__c = this.createStyleString(new_left_perc, new_top_perc);
      console.log(JSON.stringify(this.hotspots));
    }
  }
}