if('serviceWorker' in navigator){
    window.addEventListener('load', () =>{
        navigator.serviceWorker.register('/sw.js').then(registration =>{
        console.log('registration successful, scope is:', registration);
    }).catch(error =>{
        console.log('Service worker registration failed, error:', error);
    });
    });
}
window.addEventListener('load', openDatabase);

function openDatabase(){
    const apiUrl = 'https://free.currencyconverterapi.com/api/v5/countries';
    let currenciesOfCountries;
    
    let dbPromise = idb.open('currncies-country', 1, upgradeDb =>{
        let converterCurrency = upgradeDb.createObjectStore('converter', {autoIncrement: true});
    });

    let dropDown = document.getElementById('currencyFrom');
    let dropDown2 = document.getElementById('currencyTo');
    let numberToConvert = document.getElementById('numberToConvert');
    let convertButton = document.getElementById('convertButton');
    let totalConvert = document.getElementById('totalConvert');
        
    const url = 'https://free.currencyconverterapi.com/api/v5/countries';
        
    fetch(url).then(response =>{
        return response.json();
    }).then(data =>{
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
        }).then(conData =>{

            dbPromise.then(db =>{
                let key = fromTo;
                let value = conData[fromTo].val;
                let converterFromTos = {id :key, value};
                let tx = db.transaction('converter', 'readwrite');
                let store = tx.objectStore('converter');
                store.put(converterFromTos, key);
                return tx.complete;

            }).catch(err => console.log('Error -', err));
            
            const toGetCurrencyVal = conData[fromTo];
            let totalCalc = numberToConvert.value * toGetCurrencyVal.val;
            totalConvert.value = totalCalc.toFixed(2);

        }).catch(() =>{
            dbPromise.then((db) =>{
                 let tx = db.transaction('converter');
                 let store = tx.objectStore('converter');
                 return store.getAll();

               }).then(converter => {
                    for(key in converter){
                       if(converter[key].id === fromTo){
                        const toGetCurrencyVal = converter[key].value;
                        let totalCalc = numberToConvert.value * toGetCurrencyVal;
                        totalConvert.value = totalCalc.toFixed(2);}
                   }    
            });  
            });
    });
    
}