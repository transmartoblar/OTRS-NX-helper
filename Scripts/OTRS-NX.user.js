// ==UserScript==
// @name        OTRS-NX
// @namespace   http://www.transmar.fi
// @updateURL   https://github.com/transmartoblar/OTRS-NX-helper/raw/master/Scripts/OTRS-NX.user.js
// @version     0.1
// @include     http://kundservice.transmar.fi/otrs/*
// @include     http://fp.transmar.fi/FPNX/*
// @grant       GM_setValue
// @grant       GM_getValue
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// ==/UserScript==

window.onload=init;
let fillinvalsdone=false;

function init(){
    console.log("init");
    if (window.location.href.indexOf("kundservice.transmar.fi") != -1) {
        addButtonToOTRS();
    }
    if(window.location.href.indexOf("fp.transmar.fi") != -1){
        addToNx();
    }
}

function addToNx(){
    //Adds another button next to "Lägg till ny kund"
    const newCustomerButtonContainer = document.querySelector(".k-grid-toolbar");
    const newCustomerButton = document.querySelector(".k-grid-add").cloneNode();
    newCustomerButton.removeAttribute("href");
    newCustomerButton.setAttribute("class","k-button k-button-icontext k-grid-add2");
    newCustomerButton.onclick=addCustomer;
    newCustomerButton.innerHTML = "<span class='k-icon k-add'></span>Skapa ny med sparad info";
    newCustomerButtonContainer.appendChild(newCustomerButton);
    //Add agreement
    let agreementbuttonadded = false;
    waitForKeyElements(".k-grid-AddArticleAgreement",function(){
        if(!agreementbuttonadded){
            console.log("add agreementButton");
            const newAgreementButtonContainer = document.querySelectorAll("div.k-header.k-grid-toolbar.k-grid-top")[1];
            const newAgreementButton = document.querySelector(".k-grid-AddArticleAgreement").cloneNode();
            newAgreementButton.removeAttribute("href");
            newAgreementButton.setAttribute("class","k-grid-AddArticleAgreement2 k-button k-button-icontext");
            newAgreementButton.innerHTML = "<span></span>Lägg till abonnemang - Sparad info";
            newAgreementButton.onclick=addAgreement;
            newAgreementButtonContainer.appendChild(newAgreementButton);
            agreementbuttonadded = true;
        }
    });
}

function addAgreement(){
    console.log("addAgreement");
    document.querySelector(".k-grid-AddArticleAgreement").click();
    waitForKeyElements("#ContextEntity_lArticleId_listbox", fillinAgreement);
}

function fillinAgreement(){
    console.log("fillinAgreement");
    const article = document.querySelector("#ContextEntity_lArticleId_listbox");
    article.click();
    article.children[8].click();
}

function addCustomer(){
    console.log("addCustomer");
    document.querySelector(".k-grid-add").click();
    waitForKeyElements("#ContextEntity_strCustomerFirstName", fillincustomer);
    waitForKeyElements("#ContextEntity_nFirstInvoiceMonth_listbox",fillinCustomerAgreement);
    waitForKeyElements("#ContextEntity_strPickupAddress",fillinPickup);

}

function fillinPickup(){
    const district = document.querySelectorAll("#ContextEntity_lFpGroupId_listbox")[2];
    district.click();
    district.children[4].click();
    const address = document.querySelector("#ContextEntity_strPickupAddress");
    const zipcode = document.querySelector("#ContextEntity_strPickupZipCode");
    const ort = document.querySelector("#ContextEntity_strPickupCity");
    const name = document.querySelector("#ContextEntity_strPickupName");
    document.querySelector(".mapSearchAddressBtn").click();
    waitForKeyElements("#MapAddressSearchAddress_listbox",function(){
        const selAdr = document.querySelector("#MapAddressSearchAddress_listbox");
        selAdr.click();
        selAdr.children[0].click();
        document.querySelectorAll(".fp-form-save-button")[1].click();
    });
    address.value= "adress2";
}

function fillinCustomerAgreement(){
    console.log("fillin Customer Agreement");
    const initialInvoiceMonth = document.querySelector("#ContextEntity_nFirstInvoiceMonth_listbox");
    console.log(initialInvoiceMonth);
    initialInvoiceMonth.click();
    initialInvoiceMonth.children[6].click();
    const pricelist = document.querySelectorAll("#ContextEntity_lPriceListId_listbox")[2];
    console.log(pricelist);
    pricelist.click();
    pricelist.children[13].click();
    const invoiceInterval = document.querySelector("#ContextEntity_lInvoiceGroupId_listbox");
    console.log(invoiceInterval);
    invoiceInterval.click();
    invoiceInterval.children[2].click();

}

function fillincustomer(){
    if(!fillinvalsdone){
        console.log("in waitforelement - "+fillinvalsdone);
        const district = document.querySelector("#ContextEntity_lFpGroupId_listbox");
        district.children[2].click();
        const customerType = document.querySelector("#ContextEntity_lCustomerType_listbox");
        customerType.children[1].click();
        const firstName = document.querySelector("#ContextEntity_strCustomerFirstName");
        const lastName = document.querySelector("#ContextEntity_strCustomerLastName");
        const address = document.querySelector("#ContextEntity_strCustomerAddress");
        const co = document.querySelector("#ContextEntity_strCustomerAddressCareOf");
        const zipcode = document.querySelector("#ContextEntity_strCustomerZipCode");
        const ort = document.querySelector("#ContextEntity_strCustomerCity");
        const country = document.querySelector("#ContextEntity_strCustomerCountry");
        const email = document.querySelector("#ContextEntity_strCustomerEmail");
        const phone = document.querySelector("#ContextEntity_strCustomerPhoneNumber");
        const mobile = document.querySelector("#ContextEntity_strCustomerMobilePhoneNumber");
        const pricelist = document.querySelector("#ContextEntity_lPriceListId_listbox");
        let plChoices = pricelist.children;

        plChoices[13].click();
        firstName.value="test";
        lastName.value="kund";
        address.value="Vikingagränd 6";
        co.value="cococ";
        zipcode.value="22100";
        ort.value="Mariehamn";
        if(country.value==""){
            country.value="AX";
        }
        email.value="tobias.larsson@transmar.fi";
        phone.value="124333";
        fillinvalsdone=true;

    }
}

function getAllElementsWithAttribute(attribute,value){
    var matchingElements = [];
    var allElements = document.getElementsByTagName('*');
    for (var i = 0, n = allElements.length; i < n; i++)
    {
        const attr = allElements[i].getAttribute(attribute);
        if (attr !== null)
        {
            // Element exists with attribute. Add to array.
            if(attr==value){
                matchingElements.push(allElements[i]);
            }
        }
    }
    return matchingElements;
}

function gatherFormData(){
    console.log("gatherFormData");
    const mailBody = document.querySelector(".ArticleBody");
    console.log(mailBody.innerText);
}

function addButtonToOTRS(){
    const liNode = document.createElement("li");
    const liText = "<p>Samla formulär-info</p>";
    liNode.innerHTML = liText;
    console.log(liNode);
    let navBars = document.querySelectorAll(".Actions");
    navBars = navBars[navBars.length-1];
    console.log(navBars);
    navBars.appendChild(liNode);
    liNode.style.cursor="pointer";
    liNode.onclick=gatherFormData;
}
