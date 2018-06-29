if('serviceWorker' in navigator){
    window.addEventListener('load', () =>{
        navigator.serviceWorker.register('/javascript/sw.js').then(registration =>{
        console.log('registration successful, scope is:', registration);
    }).catch(error =>{
        console.log('Service worker registration failed, error:', error);
    });
    });
}
window.addEventListener('load', openDatabase);


function openDatabase(){
    const numberToConvert = document.getElementById('numberToConvert');
    const convertButton = document.getElementById('convertButton');
    const totalConvert = document.getElementById('totalConvert');
    const dropDown = document.getElementById('currencyFrom');
    const dropDown2 = document.getElementById('currencyTo');
    const apiUrl = 'https://free.currencyconverterapi.com/api/v5/countries';
    let currenciesOfCountries;
    let converterFromTos;
    let dbPromise = idb.open('currncies-country', 1, upgradeDb =>{
        switch(upgradeDb.oldVersion){
            case 0:
                let store = upgradeDb.createObjectStore('currencies', {keyPath: 'currencyName'});
            case 1:
                let converterCurrency = upgradeDb.createObjectStore('converter', {keyPath: 'val'});
        }
    });
    fetch(apiUrl).then(response =>{
        return response.json();
    }).then(currencies =>{
        console.log(currencies);
        dbPromise.then(db =>{
            console.log(db);
            currenciesOfCountries = currencies.results;
            console.log(currenciesOfCountries);
            let tx = db.transaction('currencies', 'readwrite');
            let store = tx.objectStore('currencies');
            Object.keys(currenciesOfCountries).forEach(currenciesOfCountry =>{
                store.put(currenciesOfCountries[currenciesOfCountry]);
            });
            return tx.complete;
        }).catch(err => console.log('Error -', err));
    });
    dbPromise.then(db =>{
        let tx = db.transaction('currencies', 'readonly');
        let store = tx.objectStore('currencies'); 
        return store.getAll();
    }).then(currencies => {
        let option;
        let option2;
        console.log(currencies)
        for(key in currencies){
            option = document.createElement('option');
            option.text = currencies[key].currencyId + "  |  " + currencies[key].currencyName ;
            option.value = currencies[key].currencyId;
            
            option2 = document.createElement('option');
            option2.text = currencies[key].currencyId + "  |  " + currencies[key].currencyName;
            option2.value = currencies[key].currencyId;
            
            dropDown.appendChild(option);
            dropDown2.appendChild(option2);
        }
    }).catch(err => console.log('Fetch Error -', err));

    convertButton.addEventListener('click', () =>{
        let convertFrom = dropDown.value;
        let convertTo = dropDown2.value;
        let fromTo = convertFrom+'_'+convertTo;
        let convertUrl = 'https://free.currencyconverterapi.com/api/v5/convert?q='+fromTo+'&compact=y';

        fetch(convertUrl).then(response =>{
            return response.json();
        }).then(converter =>{
            console.log(converter);
            dbPromise.then(db =>{
                console.log(db);
                converterFromTos = converter[fromTo];
                console.log(converterFromTos);
                let tx = db.transaction('converter', 'readwrite');
                let store = tx.objectStore('converter');
                Object.keys(converterFromTos).forEach(converterFromTo =>{
                    store.put(converterFromTos[converterFromTo]);
                });
                return tx.complete;
            }).catch(err => console.log('Error -', err));
        });
        dbPromise.then(db =>{
            let tx = db.transaction('converter', 'readonly');
            let store = tx.objectStore('converter'); 
            return store.getAll();
        }).then(converter => console.log(converter))
    })
}
/*
function getDropdown(){
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
        console.log(data);
        let myObj = data.results;
        console.log(myObj);
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
            const toGetCurrencyVal = conData[fromTo];
            console.log(toGetCurrencyVal);
            totalConvert.value = numberToConvert.value * toGetCurrencyVal.val;
        }).catch(err => console.log('Fetch Error -', err));
    });
    
}
window.addEventListener('load', getDropdown);
*/