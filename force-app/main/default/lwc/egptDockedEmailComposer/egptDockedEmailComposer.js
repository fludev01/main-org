import { LightningElement, track } from "lwc";
import getResponse from "@salesforce/apex/OpenAIController.getResponse";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class EgptDockedEmailComposer extends LightningElement {
  loading = false;
  loadingMessage = "Looking up contact details...";
  showMenu = false;
  wordCount = 0;
  subject = "Enter Subject";
  sending = false;
  initialSelection = [
    {
      id: "003Kj00002ZdDYgIAJ",
      sObjectType: "Contact",
      icon: "standard:contact",
      title: "Mya Williams",
      subtitle: "Not a valid record"
    }
  ];

  errors = [];
  recentlyViewed = [];
  newRecordOptions = [
    { value: "Account", label: "New Account" },
    { value: "Opportunity", label: "New Opportunity" }
  ];

  handleLookupSelectionChange(event) {
    console.log("Event: ", JSON.stringify(event));
  }

  handleLookupSearch(event) {
    console.log("Event: ", JSON.stringify(event));
  }

  @track emailBody = "Compose Email...";

  items = [
    {
      id: "1",
      label: "Send New Product Info (Without CRM Data)",
      subject: "Introducing Our Newest Product - Don't Miss Out!",
      prompt:
        "You are a sales representative writing an email to a customer. You have a new item in stock that you would like to introduce to the customer for a purchase. Acknowledge the value and revenue this item could bring the customer if they purchase it, and add a call to action for the customer to hop on a call at their earliest convenience if they are interested or have any questions. Keep the content short, no more than 5 sentences, and express enthusiasm using exclamation points and emphatic words.",
      hawking: false
    },
    {
      id: "2",
      subject: "Introducing the K3 Alpine Jacket",
      label: "Send New Product Info (With CRM Data)",
      prompt:
        "The seller is Michelle Jung and the customer is Jason Luna. The customers company name is Big 5 Sporting Goods. The seller has owned Big 5 for 5 years. Create an email in English from Michelle Jung at Norther Trail Outfitters to Jason Luna at Big 5 Sporting Goods introducing the product the K3 Alpine Jacket, which is Introducing the K3 Alpine Jacket, your ultimate companion for conquering the outdoors. Made from high-quality 3-layer GORE-TEX Pro fabric, this lightweight, versatile jacket offers exceptional waterproofing, wind resistance, and breathability. Its innovative design ensures unrestricted movement, while advanced ventilation, ample storage, and reinforced high-wear areas provide durability and functionality. Complete with reflective details for enhanced visibility and a packable design, the K3 Alpine Jacket delivers unbeatable performance and protection for all your adventures., and explain how it can help Jason Luna and their organization. End the email with a call to action asking Jason Luna to book a call at sf.co/048282je. Keep the content short, no more than 5 sentences, and express enthusiasm using exclamation points and emphatic words. Do not include a subject.",
      hawking: true
    },
    { id: "3", subject: "", label: "Follow Up on Prior Engagement", prompt: "", hawking: true },
    { id: "4", subject: "",label: "Offer Pricing Information", prompt: "", hawking: true },
    { id: "5", subject: "", label: "Share a Case Study", prompt: "", hawking: true },
    { id: "6", subject: "", label: "Discuss Industry News", prompt: "", hawking: true }
  ];

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  selectItem(event) {
    let id = event.currentTarget.dataset.id;
    const selectedItem = this.items.find((item) => item.id === id);
    if (selectedItem.hawking) {
      this.loadingMessage = "Looking up contact details...";
      // eslint-disable-next-line
      setTimeout(() => {
        this.loadingMessage = "Looking up account details...";
      }, 2000);
    } else {
      this.loadingMessage = "Writing your email...";
    }
    this.loading = true;
    this.toggleMenu();
    this.getOpenAPIResponse(selectedItem.prompt, selectedItem.subject);
  }

  stopLoading(timeoutValue) {
    // eslint-disable-next-line
    setTimeout(() => {
      this.loading = false;
    }, timeoutValue);
  }

  getOpenAPIResponse(prompt, subject) {
    getResponse({ searchString: prompt })
      .then((result) => {
        let response = JSON.parse(JSON.stringify(JSON.parse(result)));
        if (response.error) {
          console.log(response.error.message);
          this.postError(response.error.message);
        } else {
          console.log(response);
          this.emailBody = "";
          //let suggestion = response.generations[0].text;
          let suggestion = response.choices[0].message.content;
          suggestion = suggestion.replace(/[\n\r]/g, "<br>");
          //suggestion = suggestion.substring(8);
          console.log(suggestion);
          // eslint-disable-next-line
          setTimeout(() => {
            this.loadingMessage = "Writing your email...";
            this.stopLoading(300);
            this.typeMessage(suggestion);
            this.subject = subject;
          }, 300);
        }
      })
      .catch((error) => {
        console.log("error is " + error);
        this.postError(error);
      });
  }

  postError(error) {
    const event = new ShowToastEvent({
      title: "Error",
      message: error,
      variant: "error"
    });
    this.dispatchEvent(event);
  }

  typeMessage(value) {
    this.typing = true;
    let speed = 15;
    let words = value.split(" ");
    if (this.wordCount < words.length) {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        this.emailBody += words[this.wordCount] + " ";
        this.wordCount++;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
          this.typeMessage(value);
        }, speed);
      }, 25);
    } else {
      this.typing = false;
      this.wordCount = 0;
    }
  }

  sendEmail() {
    this.sending = true;
    // eslint-disable-next-line
    setTimeout(() => {
      this.closeUtilityBar();
      const event = new ShowToastEvent({
        title: "Success!",
        message: "Email has been sent to Jason Luna!",
        variant: "success"
      });
      this.dispatchEvent(event);
    }, 1000);
  }

  closeUtilityBar() {
    const event = new CustomEvent("closeutilitybar", {
      detail: true
    });
    // Fire the custom event
    this.dispatchEvent(event);
  }
}