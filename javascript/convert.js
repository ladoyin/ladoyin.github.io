function getDropdown(){
    let dropDown = document.getElementById('currencyFrom');
    let dropDown2 = document.getElementById('currencyTo');
    let numberToConvert = document.getElementById('numberToConvert');
    let convertButton = document.getElementById('convertButton');
    let totalConvert = document.getElementById('totalConvert');
        
    const url = 'https://free.currencyconverterapi.com/api/v5/countries';
        
    fetch(url).then(function(response){
        return response.json();
    }).then(function(data){
        let option;
        let option2;
        let myObj = data.results;

        for(key in myObj){
            option = document.createElement('option');
            option.text = myObj[key].currencyId + "  |  " + myObj[key].currencyName ;
            option.value = myObj[key].currencyId;
            
            option2 = document.createElement('option');
            option2.text = myObj[key].currencyId + "  |  " + myObj[key].currencyName;
            option2.value = myObj[key].currencyId;
            
            dropDown.appendChild(option);
            dropDown2.appendChild(option2);
        }
    }).catch(err => console.log('Fetch Error -', err));

    convertButton.addEventListener('click', ()=>{
        let convertFrom = dropDown.value;
        let convertTo = dropDown2.value;
        let fromTo = convertFrom+'_'+convertTo;
        
        let convertUrl = 'https://free.currencyconverterapi.com/api/v5/convert?q='+fromTo+'&compact=y';
        fetch(convertUrl).then(response =>{
            return response.json();
        }).then(function(conData){
            const toGetCurrencyVal = conData[fromTo];
            console.log(toGetCurrencyVal);
            totalConvert.value = numberToConvert.value * toGetCurrencyVal.val;
        }).catch(err => console.log('Fetch Error -', err));
    });
}
window.addEventListener('load', getDropdown);