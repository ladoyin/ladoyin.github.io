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
/*
    fetch(apiUrl).then(response =>{
        return response.json();
    }).then(currencies =>{
        dbPromise.then(db =>{
            currenciesOfCountries = currencies.results;
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
            let currencyIdIndex = store.index('currencyid');
            return currencyIdIndex.getAll('currencyName');
        }).then(currencyId => console.log(currencyId)); 
*/
/*
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
    */
    /*
    convertButton.addEventListener('click', () =>{
        let convertFrom = dropDown.value;
        let convertTo = dropDown2.value;
        let fromTo = convertFrom+'_'+convertTo;
        let convertFromTos;
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
    });
*/

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
            let key = fromTo;
            dbPromise.then(db =>{
                let converterFromTos = conData[fromTo];
                let tx = db.transaction('converter', 'readwrite');
                let store = tx.objectStore('converter');
                store.put(converterFromTos.val, key);
                return tx.complete;
            }).catch(err => console.log('Error -', err));
            console.log(conData);
            const toGetCurrencyVal = conData[fromTo];
            let totalCalc = numberToConvert.value * toGetCurrencyVal.val;
            totalConvert.value = totalCalc.toFixed(2);
        }).catch(() =>{
            dbPromise.then((db) =>{
                 let tx = db.transaction('converter');
                 let store = tx.objectStore('converter');
                 return store.openCursor();
               }).then(cursor => {
                   console.log(cursor);
                 if (!cursor) {
                   return;
                 }
                 }).then(function continueCursoring(cursor){
                    if(cursor.key === fromTo){
                        let cursorValue = cursor.value;
                        let totalCalc = numberToConvert.value * cursorValue;
                        totalConvert.value = totalCalc.toFixed(2);
                   }
                 return cursor.continue().then(continueCursoring);
                 })
                   //Working with data got from IndexedD
    });
    
}