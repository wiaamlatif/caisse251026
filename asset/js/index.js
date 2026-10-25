var currentTable = null;

var table_name = ['',//0
                 'users',//1
                 'categories',//2
                 'tickets',//3
                 'lignes_ticket',//4
                 'products',//5
                 'etat_z'//6
                ];//6

var idFirstTrProduct = null;

//var currentTable = 'users';

var currentSelected = {
            users: null,
          tickets: null,
    lignes_ticket: null,
       categories: null,
         products: null,
           etat_z: null
};

var min = {
        users: null,
      tickets: null,
lignes_ticket: null,
    categories: null,
      products: null,
        etat_z: null
};

var max = {
        users: null,
      tickets: null,
lignes_ticket: null,
    categories: null,
      products: null,
        etat_z: null
};


var currentUser = {  idUser : null,
                   idTicket : null } 

var   idUser = null;
var idTicket = null;


var currentTicketId = null;
var  productToAddId = null;

async function feedThermalPaper(lines) {
  try {
    const response = await fetch('feedPos80.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lines: lines })
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      throw new Error(result.error || 'The printer rejected the feed command.');
    }

  } catch (error) {
    console.error('Unable to feed the thermal printer:', error);
  }
}

async function printTicket(idTicket) {
  try {
    const response = await fetch('feedPos80.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idTicket: idTicket })
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      throw new Error(result.error || 'The ticket could not be printed.');
    }
  } catch (error) {
    console.error('Unable to print ticket:', error);
  }
}

//          /\
//         //\\
//        ======
//    ===============
//=========================
// =======( TIMING )========
//==========================
function startTime() {
  const today = new Date();
  var h = today.getHours();   
  var m = today.getMinutes(); 
  var s = today.getSeconds();    
  m = checkTime(m);  
  s = checkTime(s);

  var myTime = h + ':' + m + ':' + s;
  
  document.getElementById('displayTime').innerHTML = myTime;
  setTimeout(startTime, 1000);
}//startTime

function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}//checkTime 


function initKeyboardNavigation(){
    
    document.addEventListener('keydown', (event) => {

        if (event.target && ['INPUT','TEXTAREA','SELECT'].includes(event.target.tagName)) {
        return; }

        console.log("event  : "+event.key);

        switch (event.key) { 

            case 'Home':
              event.preventDefault(); 

              idUser = localStorage.getItem('idUser');
              idTicket = localStorage.getItem('idTicket');

              window.location = "http://localhost:8000/index.php?idUser="+idUser+"&idTicket="+idTicket;              
              
              currentTable = 'users';                        

            break;

            case 'Insert':  
              event.preventDefault();
              
                feedThermalPaper(1);
              

            break;            

            case 'Delete':  
                event.preventDefault();
                if(currentTable == table_name[4] && findSelectedLineTicketId() !== null && findTicketsId() !== null ){  
                deleteItemTicket(currentTicketId,findSelectedLineTicketId())
                } else {                
                  document.querySelector('#captionLineTicket').classList.textContent = 'Selectionner le ticket et la ligne à supprimer';
                  document.getElementById('captionLineTicket').innerHTML = `<div class="text text-center fs-6 fw-bold">
                  <span class="text-bg-danger fs-6 rounded-pill nowrap px-3 py-2">Selectionner le ticket et la ligne à supprimer</span>
                 </div>`;
                } 

            break;                              

            case 'End':  
                event.preventDefault(); 
                if(currentTable == table_name[4] && findTicketsId() !== null && findSelectedLineTicketId() !== null){
                deleteLinesTicket(findTicketsId())                    
                } else {
                  console.log('No ticket selected to delete all lines');
                } 
            break;                  

            case 'Escape':
                event.preventDefault();

                currentTable = 'lignes_ticket';                           
            break;

            case 'Tab':
                event.preventDefault();


            break;            

            case 'PageUp':          
                event.preventDefault();

                if(currentTable == 'products' ) {
                  
                  currentTable = 'lignes_ticket';

                }                 
              
            break;

            case 'PageDown':
                event.preventDefault();

                if(currentTable == 'lignes_ticket') {
                        
                  currentTable = 'products';

                }                                               
            break;  
            
            case 'ArrowUp':
                event.preventDefault();

                //--------------(users)---------------//                
                if(currentTable == 'users') {

                  var currentIdUser = getRowUsers(); 
                      currentIdUser = Number(currentIdUser);
                  
                  var  prevIdUser ="";
                  
                  if( currentIdUser > min['users']){  

                      prevIdUser = document.querySelector('#trUser'+String(currentIdUser)).previousElementSibling.dataset.iduser;                      
                  }

                  if(Number(getRowUsers()) == Number(min['users'])){

                    setRowUsers(max['users']);
                    displayTickets(max['users']);
                    localStorage.setItem('idUser',String(max['users']));

                  } else { 

                   setRowUsers(prevIdUser); 
                   displayTickets(prevIdUser);
                   localStorage.setItem('idUser',String(prevIdUser));

                  }                  

                  //display user's photo       
                  document.getElementById("idImgUser").src = document.getElementById("idPhotoUser"+String(getRowUsers())).src; 
                  document.getElementById("idSpanFirstName").innerText = document.getElementById("idNameUser"+String(getRowUsers())).textContent;
                                                                     
                  
                //--------------(tickets ArrowUp)-------------//                  
                } else if(currentTable == 'tickets') {
                                                              
                  var currentIdTicket = localStorage.getItem('idTicket');
                  var  prevIdTicket ="";

                  if(Number(currentIdTicket) > min['tickets']){
                      prevIdTicket = document.querySelector('#trTickets'+String(getRowTickets())).previousElementSibling.dataset.idtickets;                      
                  }

                  if(Number(getRowTickets()) == Number(min['tickets']) ){                    
                    setRowTickets(max['tickets']); 

                    displayDetailScrollingTickets(max['tickets']);

                     localStorage.setItem('idTicket',String(max['tickets']));
                 

                  } else { 
                   setRowTickets(prevIdTicket);  

                    displayDetailScrollingTickets(prevIdTicket);

                    localStorage.setItem('idTicket',String(prevIdTicket));

                  }
                                                                    
                //--------------(lignes_ticket ArrowUp)-------------//                  
                } else if(currentTable == 'lignes_ticket') { 

                  var idLineTicket = getRowTicket();                
                  var prevIdTicket = "";
                  
                  if(Number(idLineTicket) > min['lignes_ticket']){
                    prevIdTicket = document.querySelector('#trTbodyTicket'+String(getRowTicket())).previousElementSibling.dataset.idligneticket;                      
                  }

                  if(Number(getRowTicket()) == Number(min['lignes_ticket']) ){  

                    setRowTicket(max['lignes_ticket']);   
                                    
                  } else { 

                    setRowTicket(prevIdTicket); 

                  }

                 
                } else if(currentTable == 'products') {
                  moveProductSelection(-4);
                } 
               
            break;

            case 'ArrowDown':      
                event.preventDefault();

                //--------------(users)---------------//
                if(currentTable == 'users') {
                
                  var currentIdUser = localStorage.getItem('idUser');
                      currentIdUser = Number(currentIdUser);


                  var nextIdUser ="";
                 
                  if( currentIdUser <max['users'] ){
                      nextIdUser = document.querySelector('#trUser'+String(currentIdUser)).nextElementSibling.dataset.iduser;
                  }

                  if(Number(getRowUsers()) == Number(max['users']) ){                    

                   setRowUsers(min['users']); 

                   displayTickets(min['users']);
                   localStorage.setItem('idUser',String(min['users']));


                  } else { 

                   setRowUsers(nextIdUser);
                   displayTickets(nextIdUser);
                   localStorage.setItem('idUser',String(nextIdUser));

                  }                  
                     
                  //display user's photo       
                  document.getElementById("idImgUser").src = document.getElementById("idPhotoUser"+String(getRowUsers())).src; 
                  document.getElementById("idSpanFirstName").innerText = document.getElementById("idNameUser"+String(getRowUsers())).textContent;                  
                                    
                //--------------(tickets ArrowDown)-------------//
                } else if(currentTable == 'tickets') { 
                 
                  var currentIdTicket = getRowTickets();                
                  var  nextIdTicket ="";

                  if(Number(currentIdTicket)<max['tickets']){
                      nextIdTicket = document.querySelector('#trTickets'+String(getRowTickets())).nextElementSibling.dataset.idtickets;                      
                  }

                  if(Number(getRowTickets()) == Number(max['tickets']) ){ 

                   setRowTickets(min['tickets']); 

                   displayDetailScrollingTickets(min['tickets']);

                   localStorage.setItem('idTicket',String(min['tickets']));

                  } else { 

                   setRowTickets(nextIdTicket); 

                   displayDetailScrollingTickets(nextIdTicket);

                   localStorage.setItem('idTicket',String(nextIdTicket));

                  }

                  
                //--------------(lignes_ticket ArrowDown)-------------//
                } else if(currentTable == 'lignes_ticket') { 

                  var idLineTicket = getRowTicket();                
                  var nextIdTicket = "";
                  
                  if(Number(idLineTicket) < max['lignes_ticket']){
                    nextIdTicket = document.querySelector('#trTbodyTicket'+String(getRowTicket())).nextElementSibling.dataset.idligneticket;                      
                  }

                  if(Number(getRowTicket()) == Number(max['lignes_ticket']) ){                    
                    setRowTicket(min['lignes_ticket']);                   
                  } else { 
                    setRowTicket(nextIdTicket);                    
                  }
                                   
                //---------------(products)----------------// 
                } else if(currentTable == 'products') {
                  moveProductSelection(4);
                }   
              
            break;

            case 'ArrowRight':
              event.preventDefault();

              if(currentTable == 'lignes_ticket') {
             
              getQuantity(findTicketsId(),findSelectedLineTicketId(),1)                         
          
              } else if(currentTable == table_name[5]) {
                moveProductSelection(1);
              } 

            break;             

            case 'ArrowLeft':
              event.preventDefault();
               
              if(currentTable == table_name[4]) {


                getQuantity(findTicketsId(),findSelectedLineTicketId(),0)                         

              } else if(currentTable == table_name[5]) {
                 moveProductSelection(-1);
              } 

            break;
            
            case 'Enter':                  
                event.preventDefault();

                
                console.log('> 604currentTable :'+currentTable)

                switch (currentTable) { 

                  //==(Enter)
                  case 'users':

                    event.preventDefault();

                    // Ici lire selected idUser  -> localStorage
                    var idUser = localStorage.getItem('idUser');
                                      
                    var idTicket = localStorage.getItem('idTicket');
                    
                    displayTickets(idUser);
                                      
                    currentTable = 'tickets';  

                  break;                                    

                  //==(Enter)
                  case 'tickets':
                    event.preventDefault();
                    
                    // Ici lire selected idTicket  -> localStorage
                    idTicket = localStorage.getItem('idTicket');
                    window.location = "http://localhost:8000/front/modifTicket.php?idTicket="+idTicket //+Number(getRowTickets())

                    colorFirstRowTicket();

                    currentTable = 'lignes_ticket';
                 
                  break;                  

                  //==(Enter)                  
                  case 'lignes_ticket':
                    event.preventDefault();

                    currentTable = 'products';
                    console.log('>>443',currentTable);
                    //currentTable = 'products';

                  break;                  
                  
                  //==(Enter)                  
                  case 'products':
                    event.preventDefault();
                  
                    var idProductToAdd = null;

                    //productToAddId
                    const rows = document.querySelectorAll('#tbodyProducts .product-card');
                    rows.forEach(row => {
                      if(row.classList.contains("bg-success")){
                        idProductToAdd = row.dataset.idproduct ;                          
                      }                      
                    })  

                    idTicket = document.querySelector("#trHeadTicket").dataset.idticket;
                         
                      idUser = localStorage.getItem('idUser');
                    idTicket = localStorage.getItem('idTicket');

                    ChangeQuantityOrAddProduct(idUser,idTicket,idProductToAdd);

                    console.log('products idTicket :'+idTicket);
                    console.log('products productToAddId :'+idProductToAdd); 
  
                  break;

                 }//switch

            break;//Enter      

            case 'F1':
              event.preventDefault();
              
                //display table user -> color firstRow
                // display table tickets user -> color first Row
                idUser = localStorage.getItem('idUser');
              idTicket = localStorage.getItem('idTicket');
              
              window.location = "http://localhost:8000/index.php?idUser="+idUser+"&idTicket="+idTicket;              
              
              currentTable = 'users';          
            break;

            case 'F2':
              event.preventDefault(); 

              var   idUser = localStorage.getItem('idUser');
              var idTicket = localStorage.getItem('idTicket');
              
              window.location = "http://localhost:8000/index.php?idUser="+idUser+"&idTicket="+idTicket;

              currentTable = 'tickets';          
            //  colorFirstRowTickets()
            //  clearColorRowsUsers();               
            break;

            case 'F3':
              event.preventDefault();

              displayProducts();
            break;

            case 'F4':
                event.preventDefault();

                
            break;

            case 'F5':
                event.preventDefault();

                activateRadioButton('btnradio1');                
            break;

            case 'F6':
                event.preventDefault();

                activateRadioButton('btnradio2');                
            break;
            
            case 'F7':
                event.preventDefault();

                activateRadioButton('btnradio3');                
            break;                            
        
        }//switch                

    });//addEventListener()

    // Handle Mouse Pointer
    // Only rows with the green highlight use the pointer cursor on hover.
    document.addEventListener('mouseover', function(event) {
    var row = event.target.closest('tr');
    if (!row || !row.closest('tbody')) return;
    row.style.cursor = row.classList.contains('bg-success') ? 'pointer' : 'default';
    });

    document.addEventListener('mouseout', function(event) {
    var row = event.target.closest('tr');
    if (!row || !row.closest('tbody')) return;
    row.style.cursor = 'default';
    });


} //initKeyboardNigation()


//////////////////////////////////////////////
////////////  Start RadioButtons  ///////////
////////////////////////////////////////////

function initRadioButtons() {

  var btnRadio1 = document.getElementById('btnradio1');
  var btnRadio2 = document.getElementById('btnradio2');
  var btnRadio3 = document.getElementById('btnradio3');
  

  if (btnRadio1) {  

    btnRadio1.addEventListener('change', function() {
      if (!this.checked) return;

      if(this.checked) {

        console.log('>579 Ici Tickets',);

      }
        
    });
  }//btnRadio1

    if (btnRadio2) {  

    btnRadio2.addEventListener('change', function() {
      if (!this.checked) return;

      if(this.checked) {
        console.log('>593 Ici Serveurs',);
      }
        
    });
  }//btnRadio2

    if (btnRadio3) {  

    btnRadio3.addEventListener('change', function() {
      if (!this.checked) return;

      if(this.checked) {
        console.log('>605 Ici Produits',);
      }
        
    });
  }//btnRadio3
 

  
}//initRadioButtons

function getRadioButtons() {
  return [
    document.getElementById('btnradio1'),
    document.getElementById('btnradio2'),
    document.getElementById('btnradio3'),
  ].filter(Boolean);
}

function moveRadioSelection(direction) {
  var radios = getRadioButtons();
  if (radios.length === 0) return;

  var currentIndex = radios.findIndex(function(radio) {
    return radio.checked;
  });

  if (currentIndex === -1) {
    currentIndex = direction > 0 ? 0 : radios.length - 1;
  }

  var nextIndex = (currentIndex + direction + radios.length) % radios.length;
  var nextRadio = radios[nextIndex];

  if (!nextRadio) return;

  nextRadio.checked = true;
  nextRadio.dispatchEvent(new Event('change', { bubbles: true }));
}

function activateRadioButton(radioId) {
  var radio = document.getElementById(radioId);
  if (!radio) return;

  radio.checked = true;
  radio.dispatchEvent(new Event('change', { bubbles: true }));
}


////////////////////////////////////////////////
////////////   End RadioButtons  //////////////
//////////////////////////////////////////////


function getTableRows(tableName) {
  switch (tableName) {
    case 'users':
      return document.querySelectorAll('#tbodyUsers tr');
    case 'tickets':
      return document.querySelectorAll('#tbodyTickets tr');
    case 'lignes_ticket':
      return document.querySelectorAll('#tbodyTicket tr');
    case 'categories':
      return document.querySelectorAll('#tbodyCategories tr');
    case 'products':
      return document.querySelectorAll('#tbodyProducts .product-card');
    default:
      return [];
  }
}

function getRowId(row, tableName) {
  if (!row) return null;
  switch (tableName) {
    case 'users':
      return row.dataset.iduser ;
    case 'tickets':
      return row.dataset.idticket;
    case 'lignes_ticket':
      currentSelected['tickets'] = row.dataset.idticket;
      return row.dataset.idligneticket;
    case 'categories':
      return row.dataset.idcategory;
    case 'products':
      return row.dataset.idproduct;
    default:
      return null;
  }
}

function highlightRow(tableName, id) {
  var rows = getTableRows(tableName);
  rows.forEach(function(row) {
    row.classList.remove('bg-success');
  });
  var selector = '';
  switch (tableName) {
    case 'users':
      selector = '#tbodyUsers tr[data-iduser="' + id + '"]';
      break;
    case 'tickets':                
      selector = '#tbodyTickets tr[data-idticket="' + id + '"]';
      break;
    case 'lignes_ticket':
      selector = '#tbodyTicket tr[data-idligneticket="' + id + '"]';
      break;
    case 'categories':
      selector = '#tbodyCategories tr[data-idcategory="' + id + '"]';
      break;
    case 'products':
      selector = '#tbodyProducts .product-card[data-idproduct="' + id + '"]';
      break;
  }
  var row = document.querySelector(selector);
  if (row) {
    row.classList.add('bg-success');
    row.focus();
  }
}

function selectRow(tableName, id, activate) {
  if (activate === undefined) activate = false;
  currentTable = tableName;
  currentSelected[tableName] = id;
  highlightRow(tableName, id);
  switch (tableName) {
    case 'users':
      if (activate) { displayUsers(); }
      break;
    case 'tickets':
      if (activate) { displayTickets(id); }
      break;
    case 'lignes_ticket':
      if (activate) { displayTicket(id); }
      break;      
    case 'categories':
      if (activate) { displayCategories(id); }
      break;
    case 'products':
      if (activate) { displayProducts(id); }
      break;
    case '':
      break;
  }
}

function moveSelection(direction) {
  var allTrBody = document.querySelectorAll('#tbodyTicket tr');  //getTableRows(currentTable);
  var rows = Array.from(allTrBody);
  if (rows.length === 0) return;
  var currentId = currentSelected[currentTable];
  var index = rows.findIndex(row => String(getRowId(row,currentTable)) === String(currentId));
  if (index === -1) { index = 0; }
  var newIndex = index + direction;
  if (newIndex < 0) newIndex = 0;
  if (newIndex >= rows.length) newIndex = rows.length - 1;
  var newId = getRowId(rows[newIndex], currentTable);
  if (newId != null) {
    selectRow(currentTable, Number(newId), false);
  }
}


function moveProductSelection(direction) {
  if (currentTable !== table_name[5]) {
    moveSelection(direction);
    return;
  }

  var cards = Array.from(getTableRows('products'));
  if (cards.length === 0) return;

  var currentId = currentSelected.products;
  var index = cards.findIndex(card => String(card.dataset.idproduct) === String(currentId));
  if (index === -1) index = 0;

  var newIndex = Math.max(0, Math.min(cards.length - 1, index + direction));
  selectRow('products', Number(cards[newIndex].dataset.idproduct), false);
}


//=========================(Init Light Row displayTickets)================================
function colorRowTickets(idTicket){

  if(document.querySelectorAll(".trTicketTable3")){

    var rows = document.querySelectorAll('.trTicketTable3');
    rows.forEach(row => {row.classList.remove('bg-success')});

    //var selector = '#trTicket'+String(idTicket);
    //document.querySelector(selector).classList.add('bg-success'); 
    
    var colorRow = document.querySelector('#trTicket'+String(idTicket))

    if(colorRow){

      colorRow = colorRow.classList.add('bg-success')

    }      
  }  
}

//idTable2 'etat_z'
function colorFirstRowEtatZ(){
 
 if(document.querySelectorAll(".trIdz")){ 
    
    rows = document.querySelectorAll('.trIdz');

    rows.forEach(row => {row.classList.remove('bg-success')});
 }

 document.querySelector("#tbodyEtatZ tr").classList.add("bg-success");
 
 currentSelected['etat_z'] = document.querySelector("#tbodyEtatZ tr").dataset.idz; //The selected idz
 
}

//idTable2
function setRowEtatZ(idz){

  if(document.querySelectorAll(".trIdz")){ 
    
    rows = document.querySelectorAll('.trIdz');

    rows.forEach(row => {row.classList.remove('bg-success')});

    var setRow = document.querySelector('#trIdz'+String(idz))

    if(setRow){

      setRow.classList.add('bg-success')

    }
  }
}

//idTable2
function getRowEtatZ(){

  var idz = null;

  var rows = document.querySelectorAll('.trIdz');

  rows.forEach(row => {
      if(row.classList.contains('bg-success')){
        idz = row.dataset.idz;
        currentSelected['etat_z'] = idz; //The selected idz         
      }
  })

  return idz;

} //getRowEtatZ() 

//=============(Start color Users)====================

function clearColorRowsUsers(){

  var rows = document.querySelectorAll('.trUser');
  rows.forEach(row => {row.classList.remove('bg-success')});
 
}

function colorFirstRowUsers(){

  var rows = document.querySelectorAll('.trUser');
  rows.forEach(row => {row.classList.remove('bg-success')});
  
  document.querySelector('#tbodyUsers tr').classList.add('bg-success')
  
}

function getRowUsers(){

  var idUser = null;

  var rows = document.querySelectorAll('.trUser');

  rows.forEach(row => {
      if(row.classList.contains('bg-success')){
        idUser = row.dataset.iduser;
        currentSelected['users'] = idUser; //The selected idz  
      }
  })

  return idUser;

} //getRowUsers() 

function setRowUsers(idUser){

  var rows = document.querySelectorAll('.trUser');
  rows.forEach(row => {row.classList.remove('bg-success')});
  
 var colorRow = document.querySelector('#trUser'+String(idUser))
   
  if(colorRow){
    colorRow = colorRow.classList.add('bg-success')
  }      
    
}

//=============(End color Users)====================


//=============(Start color tickets)================

function clearColorRowsTickets(){

  if(document.querySelector("#tbodyTickets tr")){

    var rows = document.querySelectorAll('#tbodyTickets tr');
    rows.forEach(row => {row.classList.remove('bg-success')});
    
  }  

}//clearColorRowsTickets

function colorFirstRowTickets(){
  if(document.querySelector("#tbodyTickets tr")){

    var rows = document.querySelectorAll('#tbodyTickets tr');
    rows.forEach(row => {row.classList.remove('bg-success')});

    document.querySelector("#tbodyTickets tr").classList.add('bg-success');
    
  }  

}//colorFirstRowTickets

function getRowTickets(){

  var idTickets = null;

  var rows = document.querySelectorAll('.trTickets');

  rows.forEach(row => {
      if(row.classList.contains('bg-success')){
        idTickets = row.dataset.idtickets;
        currentSelected['tickets'] = idTickets; //The selected idz          
      }
  })

  return idTickets; 

} //getRowUsers() 

function setRowTickets(idTickets){

  var rows = document.querySelectorAll('.trTickets');
  rows.forEach(row => {row.classList.remove('bg-success')});
  
  var colorRow = document.querySelector('#trTickets'+String(idTickets))
  
  if(colorRow){
    colorRow = colorRow.classList.add('bg-success')
  }      
    
}


//=============(End color tickets)=================
//_________________________________________________

//=============(Start color ticket)================

function clearColorRowsTicket(){

  if(document.querySelector("#tbodyTicket tr")){

    var rows = document.querySelectorAll('#tbodyTicket tr');
    rows.forEach(row => {row.classList.remove('bg-success')});
    
  }  

}//

function colorFirstRowTicket(){

  var rows = document.querySelectorAll('.trTbodyTicket');

  if(rows.length < 2 ) return;

  rows.forEach(row => {row.classList.remove('bg-success')});

  var firstRowId = document.querySelector("#tbodyTicket tr").dataset.idligneticket;
  var selector = '#trTbodyTicket'+String(firstRowId);
  document.querySelector(selector).classList.add('bg-success');
  
}

function getRowTicket(){

  var idLignesTicket = null;

  var rows = document.querySelectorAll('.trTbodyTicket');

  rows.forEach(row => {
      if(row.classList.contains('bg-success')){
        idLignesTicket = row.dataset.idligneticket;
        currentSelected['lignes_ticket'] = idLignesTicket; //The selected idz          
      }
  })

  return idLignesTicket; 

} 

function setRowTicket(idLignesTicket){

  var rows = document.querySelectorAll('.trTbodyTicket');
  rows.forEach(row => {row.classList.remove('bg-success')});
  
  var colorRow = document.querySelector('#trTbodyTicket'+String(idLignesTicket))
  
  if(colorRow){
    colorRow = colorRow.classList.add('bg-success')
  }      
    
}

//=============(End color ticket)=================

function colorFirstRowProduct(){

  if(document.querySelector("#tbodyProducts .product-card")){

    var rows = document.querySelectorAll('#tbodyProducts .product-card');
    rows.forEach(row => {row.classList.remove('bg-success')});

    var firstRowId = document.querySelector("#tbodyProducts .product-card").dataset.idproduct;
    var selector = '#productCard'+String(firstRowId);
    document.querySelector(selector).classList.add('bg-success');
  
  }  
}

function clearDeletedIndexProductTable5(idProduct,index){
 
  var xhr = new XMLHttpRequest();
                         
  xhr.open('GET','',true);

  xhr.onload = function() {

    if(xhr.status==200){

      const rowProduct = document.querySelector('#idSpanIndexProduct'+String(idProduct));

      rowProduct.textContent="";
      rowProduct.classList.remove("bg-danger");
      rowProduct.parentElement.classList.remove("bg-danger");


      console.log('idProduct :'+idProduct);
      console.log('index :'+index);

    }//200
  }//onload
   xhr.send();   
}//clearDeletedIndexProductTable5


function redAddedIndexProductTable5(idProduct,index){
 
  var xhr = new XMLHttpRequest();
                         
  xhr.open('GET','',true);

  xhr.onload = function() {

    if(xhr.status==200){
                                                  
      const rowProduct = document.querySelector('#idSpanIndexProduct'+String(idProduct));

      rowProduct.textContent=String(index);           
      rowProduct.classList.add("bg-danger");
      rowProduct.parentElement.classList.add("bg-danger");


      console.log('idProduct :'+idProduct);
      console.log('index :'+index);

    }//200
  }//onload
   xhr.send();   
}//redAddedIndexProductTable5


function displayRedIndexProducts(){

var rows = document.querySelectorAll('.trTbodyTicket');

rows.forEach( row => {

  var   idIndex = row.dataset.idindex;
  var idProduct = row.dataset.idproduct;
                        
  var   selectorIndex = "#idSpanIndexProduct"+String(idProduct);

  document.querySelector(selectorIndex).textContent=String(idIndex);           
  document.querySelector(selectorIndex).classList.add("bg-danger");
  document.querySelector(selectorIndex).parentElement.classList.add("bg-danger");        
 
})

}//displayRedIndexProducts


function displayProducts(){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'loadDataProducts.php', true);

  xhr.onload = function(){

    if(xhr.status !== 200) return;

    var data = JSON.parse(xhr.responseText);
    var table = document.getElementById('idTable5');
    if(!table) return;

    var html = '<caption class="products-caption">All products</caption>' +
               '<tbody id="tbodyProducts" class="products-grid">';

    var productIndex = 0;
    var currentCategory = null;
    var cardsInRow = 0;

    data.forEach( product => {
      if(product.name_category !== currentCategory){
        if(cardsInRow){ html += '</tr>'; cardsInRow = 0; }
        currentCategory = product.name_category;
        html += '<tr class="category-row"><th colspan="4">' + currentCategory + '</th></tr>';
      }

      if(cardsInRow === 0){
        html += '<tr id="rowsingleproduct" class="product-row">';
      }

      productIndex += 1;

      var image = product.img_product || 'default_product.png';
      var selected = productIndex === 1 ? ' bg-success' : '';
      html += '<td id="productCard' + product.id_product + '" class="product-card' + selected + '"' +
        ' data-idproduct="' + product.id_product + '" tabindex="0" onclick="selectRow(\'products\', ' + product.id_product + ')">' +
        '<div class="product-card-content">' +  

        '<div class="d-flex flex-column justify-content-center align-items-center gap-0 mt-0">'+
        '<img src="/uploads/products/' + image + '" alt="' + product.name_product + '">' +
        '<h5 class="card-title text-nowrap"><span class="text fw-bold px-3">' + product.name_product + '</span></h5>' +
        '<h4 class="card-text"><span class="product-price badge text-bg-dark rounded-pill fs-5">' + product.price + '</span></h4>' +

        '<h4 class="card-text rounded-pill w-100"><span id="idSpanIndexProduct'+product.id_product+'" class="product-index text fw-bold fs-5"></span></h4>' +        

        '</div>' +               
        '</div></td>';
      cardsInRow += 1;
      if(cardsInRow === 4){
        html += '</tr>';
        cardsInRow = 0;
      }
    });

    if(cardsInRow){ html += '</tr>'; }
    html += '</tbody>';
    table.innerHTML = html;

    colorFirstRowProduct();

//    currentTable = 'products';

    //testfunction();        

    displayRedIndexProducts();

  };//onload

  xhr.send();
}//displayProducts

function colortRowTicketTable4(idProduct){
 
  var xhr = new XMLHttpRequest();
                         
  xhr.open('GET','',true);

  xhr.onload = function() {

    if(xhr.status==200){

      const rows  = document.querySelectorAll('.trTbodyTicket') ;

       Array.from(rows).forEach(row => { row.classList.remove("bg-success") });

      Array.from(rows).forEach(row => {

        if(row.dataset.idproduct === idProduct){

          row.classList.add("bg-success")

          console.log('>1281 color row :'+row.classList);

        }   

      })

      console.log('>1287 color row idProduct :'+idProduct);

    }//200
  }//onload
   xhr.send();   
}//colortRowTicketTable4


function displayUsers(idUser){

  var xhr = new XMLHttpRequest();

  xhr.open('GET','http://localhost:8000/front/loadDataUsers.php',true);
  
  xhr.onload = function() {

    if(xhr.status==200){
     
      var data = JSON.parse(xhr.responseText);
            
      console.log('>>1253 loadDataUsers :',data);       
    
      var divTab2El = document.getElementById("divTab2");

      if( divTab2El != null){
        divTab2El.classList.add("border");
        divTab2El.classList.add("border-secondary");
      }
      
      var table = document.getElementById("idTable2") ;

      if(!table) return;

      min['users'] = data[0].id_user;
      max['users'] = data[data.length-1].id_user;
    
      var html =  '<caption class="fw-bold fs-6 mx-1">' +
                  '  <div class="text text-center fs-6 fw-bold">' +
                  '    <span class="text-bg-primary fs-6 rounded-pill nowrap px-3 py-2">List Users</span>' +
                  '  </div>' +               
                  '</caption>' + 
                  '<thead id="theadUsers">' +
                    '<tr id="trHeadUsers" class="border border-danger border-1 w-100">' +
                      '<th class="col-1 text text-center border border-dark border-1">Id</th>' +
                      '<th class="col-1 text text-center border border-dark border-1">Photo</th>' +
                      '<th class="col-2 text text-center border border-dark border-1">User</th>' +
                    '</tr>' +
                  '</thead>' +
                  '<tbody id="tbodyUsers">';

        data.forEach(element => {
        
          var idUser = element.id_user; 
          var imgSrc = element.img_user; 
              if(imgSrc==""){
              imgSrc = "default_user.png";}
              firstName = element.first_name;

          html += '<tr id="trUser'+idUser+'" class="trUser border border-dark fw-bold" ' +
                  '    data-iduser ="'+idUser+'" onclick="" tabindex="0">'  +                               
                  ' <td class=" text text-center border border-dark border-1 fs-6 fw-bold">'+idUser+'</td> ' +
                  ' <td class=" text text-center border border-dark border-1" id="imgProduct">' +            
                  '  <img id="idPhotoUser'+idUser+'" class="img img-fluid" src="/uploads/employees/'+imgSrc+'" width="50px" onclick="">' +
                  ' </td>' +
                  ' <td id="idNameUser'+idUser+'" class="text text-nowrap text-center border border-dark border-1 fs-6 fw-bold">'+firstName+'</td>' +                          
                  '</tr>' ;            
                                     
          })//data.forEach

          html += '</tbody>';

          table.innerHTML = html;
        
          //display user's photo & name       
          document.getElementById("idImgUser").src = document.querySelector('#idPhotoUser'+String(idUser)).src;
          document.getElementById("idSpanFirstName").innerText = document.querySelector('#idNameUser'+String(idUser)).textContent;
                                          
    }//status==200  

    setRowUsers(idUser)         

  }//xhr.onload

  xhr.send();   

}//displayUsers

  
function ajouterTicket(){

  var idUser = localStorage.getItem('idUser');

  var xhr = new XMLHttpRequest();

  xhr.open('GET','http://localhost:8000/front/iniTicket.php?idUser='+idUser,true)

  xhr.onload = function() {

    if(xhr.status==200){

      var  data = JSON.parse(this.response);

      console.log('>1314 data',data);

      currentTable = 'tickets';  
 
    }
  }
 
  xhr.send()
  
}//ajouterTicket


function initVente(){

console.log('>1300  Create a new ticket !')

  ajouterTicket()

}


// 'tickets',[3]
//
function displayTickets(idUser){

  var xhr = new XMLHttpRequest();

  xhr.open('GET','http://localhost:8000/front/loadDataTickets.php?idUser='+idUser,true);

  xhr.onload = function() {

    //==================( table-3)========================//     
    if(xhr.status==200){
      
      document.getElementById('divTab3').classList.add("border");
      document.getElementById('divTab3').classList.add("border-secondary");

      var table = document.getElementById("idTable3");

      if(!table) return;
      
      const data = JSON.parse(this.response);
      
      console.log('>>1210>data displayTickets():',data);
      
      var nameUser = "";

      if(data.length >0 ){
           nameUser = data[0].first_name;

           min['tickets'] = data[0].id_ticket ;
           max['tickets'] = data[data.length-1].id_ticket;

           console.log('>>1386 min',min['tickets']);
           console.log('>>1387 max',max['tickets']);
      }

      var html =  '<caption class="fw-bold fs-6 mx-1">' +
                  '  <div class="text text-center fs-6 fw-bold">' +
                  '    <span class="text-bg-primary fs-6 rounded-pill nowrap px-3 py-2">List tickets '+nameUser+'</span>' +
                  '  </div>' +               
                  '</caption>' + 
                  '<thead id="theadTickets">' +
                  '  <tr id="trTheadTickets" class="border border-danger border-1 fw-bold fs-5 w-100" >' +
                  '    <th scope="col" class="col-3  text text-center border border-dark border-1">IdTk </th>' +
                  '    <th scope="col" class="col-6 text text-center border border-dark border-1">NrTk </th>' +
                  '    <th scope="col" class="col-3  text text-center border border-dark border-1">Total</th>' +
                  '  </tr>' +
                  '</thead>' +
                  '<tbody id="tbodyTickets">';

      var somTickets = 0; 
      data.forEach(element => { 
           
        var       idTicket = element.id_ticket;
                  nameUser = element.first_name;
        var       nrTicket = element.nr_ticket ;
        var    totalTicket = element.total_ticket;
               somTickets += parseInt(totalTicket);
        
        html += '<tr id="trTickets'+idTicket+'" class="trTickets border border-dark border-1 w-100" ' +
                '    data-idtickets='+idTicket+' tabindex="0">' +
                ' <td class="text text-center border border-dark fw-bold">'+idTicket+'   </th>' +
                ' <td class="text text-center border border-dark fw-bold">'+nrTicket+'   </th>' +
                ' <td class="text text-center border border-dark fw-bold">'+totalTicket+'</td>' +
                '</tr>';
      });//forEach  
      
      html += '</tbody>' +
              '<tfoot>' +
              ' <tr>' +
              '   <td class="text text-center border border-dark fw-bold">' +
              '     <button class="btn btn-success btn-sm me-1" onclick="ajouterTicket()">Vente</button>' +
              '   </td>' +
              '   <td class="text text-center border border-dark">' +
              '      <span class="badge text-bg-dark fw-bold fs-6">Total</span>' +
              '   </td>' +
              '   <td class="text text-center border border-dark">' +
              '       <span class="text text-center text-dark fw-bold fs-6">'+somTickets.toFixed(2)+'</span>' +
              '   </td>' +
              ' </tr>' +      
              '<tfoot>';

      
      table.innerHTML = html;
      
    }//status==200
  
    setRowTickets(min['tickets']);
    localStorage.setItem('idTicket',String(min['tickets']));
   
  }//xhr.onload 

  xhr.send();

}//displayTickets  

function deleteLinesTicket(idTicket){

  var xhr = new XMLHttpRequest();
  
  xhr.open('GET','http://localhost:8000/front/deleteLinesTicket.php?idTicket='+idTicket,true);

  xhr.onload = function() {

    if(xhr.status==200){

//      var  data =  JSON.parse(this.response);
      
    displayTicket(idTicket);
    displayTfootTicket(idTicket,0)

    }//status==200
  
  }//xhr.onload 

  xhr.send();

} //deleteLinesTicket


function deleteItemTicket(idTicket,idLigneTicket){

  var xhr = new XMLHttpRequest();

  xhr.open('GET','http://localhost:8000/deleteItemTicket.php?idTicket='+idTicket+'&idLigneTicket='+idLigneTicket,true);

  xhr.onload = function() {

    if(xhr.status==200){

      var  data =  JSON.parse(this.response);

     //console.log(data);

      displayTicket(idTicket);
      displayTfootTicket(idTicket,0);

    }//status==200
  
  }//xhr.onload 

  xhr.send();

}//deleteItemTicket


function findUserId(){
                                   
                    const rows = document.querySelectorAll('.trUser');

                    rows.forEach(row => {
                      if(row.classList.contains("bg-success")){
                        userId = row.dataset.iduser ;                          
                      }                      
                    })  
                    
                    return userId;
                    
}


//The Id of Ticket in the head table Ticket.
function findTicketsId(){
                    
                    const ticketId = document.querySelector("#trHeadTicket").dataset.idticket ;
                    
                    return ticketId;
                    
}

//table4 (Ticket) => By a click on the line -> the line become green 
function rowSelected(idLigneTicket){

      currentTable = table_name[4];//'lignes_ticket'
  
      currentSelected[currentTable] = idLigneTicket;

      const rows = document.querySelectorAll("#tbodyTicket tr");

      if(rows){

        rows.forEach(row => {row.classList.remove('bg-success')});

        var selector = '#tbodyTicket tr[data-idligneticket="' + idLigneTicket + '"]';

        var row = document.querySelector(selector);

        if(row){  row.classList.add('bg-success');
                  row.focus();
                  productToAddId = row.dataset.idproduct;
          }  
                    
      }//rows


}//rowSelected


//table4 Ticket
function findSelectedLineTicketId(){

                    const tbodyTicketEl = document.getElementById("tbodyTicket");
                    const classesTicket = Array.from(tbodyTicketEl.querySelectorAll('tr'))
                    const indexGreenTicket = classesTicket.findIndex(element => element.classList.contains("bg-success")); 
                    const RowTicket = document.querySelectorAll('#tbodyTicket tr')[indexGreenTicket];          
                    const RowTicketId = RowTicket.dataset.idligneticket; 
                    return RowTicketId;
}

function getQuantity(idTicket,idLigneTicket,plusMinus){

  var xhr = new XMLHttpRequest();
    
  xhr.open('GET','http://localhost:8000/front/getQuantity.php?idTicket='+idTicket+'&idLigneTicket='+idLigneTicket+'&plusMinus='+plusMinus,true);

  xhr.onload = function() {

   if(xhr.status==200){

     var  data =  JSON.parse(this.response); 
    
     document.querySelector('#quantity'+idLigneTicket).textContent = data.quantity;

     var totalItem = data.quantity * data.price;

     document.querySelector('#spanTotalItem'+idLigneTicket).textContent = totalItem.toFixed(2);

    if(data.total_ticket !== undefined){
     document.querySelector('#spanTotalTicket').textContent = (data.total_ticket*1).toFixed(2);
    }
     
   }//status==200 
    
  }//xhr.onload 

  xhr.send();
   
}//getQuantity 


//table4 Ticket
function rowSelected(idLigneTicket){

      currentTable = table_name[4];
  
      currentSelected[currentTable] = idLigneTicket;

      const rows = document.querySelectorAll("#tbodyTicket tr");

      if(rows){

        rows.forEach(row => {row.classList.remove('bg-success')});

        var selector = '#tbodyTicket tr[data-idligneticket="' + idLigneTicket + '"]';

        var row = document.querySelector(selector);

        if(row){  row.classList.add('bg-success');
                  row.focus();
                  productToAddId = row.dataset.idproduct;
          }  
                    
      }//rows


}//rowSelected


function displayTheadTicket(idUser,idTicket){

  //============( theadTicket )================================
      var html = `
                  <tr id="trHeadTicket" data-iduser="`+idUser+`" data-idticket="`+idTicket+`"
                    class="border border-danger border-1 w-100"> 
                    <th class="col-1 text text-center border border-dark border-1">Id</th>         
                    <th class="col-2 text text-center border border-dark border-1">Image</th>
                    <th class="col-4 text text-center border border-dark border-1">Product</th>          
                    <th class="col-2 text text-center border border-dark border-1">Quantite</th> 
                    <th class="col-1 text text-center border border-dark border-1">Prix</th> 
                    <th class="col-1 text text-center border border-dark border-1">Total</th>                             
                  </tr>                                                  
                  ` ;

      document.getElementById("theadTicket").innerHTML = html ;
     
}//displayTheadTicket

function displayTbodyTicket(dataBodyTicket){
        
  var idLigneTicket = dataBodyTicket.idLigneTicket
  var      idTicket = dataBodyTicket.idTicket;
  var     idProduct = dataBodyTicket.idProduct; 
  var        imgSrc = dataBodyTicket.imgSrc;
             if(imgSrc == ''){ imgSrc = "default_product.png"; }
  var      indexRow = dataBodyTicket.indexRow;
  var   nameProduct = dataBodyTicket.nameProduct;
  var      quantity = dataBodyTicket.quantity;
  var         price = dataBodyTicket.price;
  var     totalItem = quantity * price;

  
//============================================
//=============================================

 var html = '<tr  id="trTbodyTicket'+idLigneTicket+'" class="trTbodyTicket  border border-dark border-1 w-100" ' +
            '     data-idindex="'+indexRow+'" ' +
            '     data-idligneticket="'+idLigneTicket+'" ' +
            '     data-idproduct="'+idProduct+'" ' +
            '     data-idticket="'+idTicket+'"    onclick="rowSelected('+idLigneTicket+')" tabindex="0"> ' +           

            '  <td class=" text text-center border border-dark border-1 fs-6 fw-bold">'+indexRow+'</td> ' +
                    
            '  <td class=" text text-center border border-dark border-1"> ' +
            '    <img class="img img-fluid imgProduct" '  +
            '    src="../uploads/products/'+imgSrc+'"  width="50px"> ' +                                            
            '  </td>' +

              
            '  <td class=" text text-center text-nowrap border border-dark border-1 fs-6 fw-bold">'+nameProduct+'</td> ' +
              
            '  <td class=" text text-center border border-dark border-1"><!---Quantity------> ' +
                    
            '   <div class="d-flex"> ' +             

            '      <!-- trash Btn   --> ' +                         
            '      <button id="supItemCart'+idLigneTicket+'" class="supItemCart btn btn-danger btn-sm mx-1" ' +
            '        onclick="clearDeletedIndexProductTable5('+idProduct+','+indexRow+');deleteItemTicket('+idTicket+','+idLigneTicket+')"> ' +
            '        <i class="fa-solid fa-trash-can"></i> ' +
            '      </button> ' +

            '       <!-- Btn Minus --> ' +            
            '       <button id="decrementQuantity'+idLigneTicket+'" class="decrementQuantity btn btn-primary" ' +
            '              onclick="getQuantity('+idTicket+','+idLigneTicket+','+0+')"> ' +
            '         - ' +
            '      </button> ' +

            '      <!-- Quantity   --> ' +
            '      <span id="quantity`+idLigneTicket+`" class="quantity fs-6 fw-bold py-2 my-1 w-75">'+quantity+'</span> ' +

            '      <!-- Btn plus   --> ' +
            '      <button id="incrementQuantity`+idLigneTicket+`" class="incrementQuantity btn btn-primary" ' +
            '              onclick="getQuantity('+idTicket+','+idLigneTicket+','+1+')"> ' +
            '       + ' +
            '      </button> ' +

            '    </div> ' +
            '   </td> ' +

            '   <td class="text text-center border border-dark border-1 fs-6 fw-bold">'+price+'</td> ' +

            '   <td class=" text text-center border border-dark border-1 fs-6 fw-bold"> ' +
            '     <span class="text text-bg-dark fs-6 mx-1" id="spanTotalItem'+idLigneTicket+'"> ' +
            '      '+totalItem.toFixed(2)+' ' +
            '     </span> ' +
            '   </td> ' +
                      
            '</tr>';  
                                                           
             document.getElementById('tbodyTicket').innerHTML += html;

}//displayTbodyTicket

function displayTfootTicket(idTicket,totalTicket){
    
  var total =Number(totalTicket).toFixed(2);


  var htmlFootTicket =  ` <tr> 
                              <td class="text text-center border border-dark border-1 fs-6 fw-bold" colspan="3">
                                <div class="d-flex justify-content-center">
                                                      <!-- Btn Trash   -->
                                  <button class="btn btn-danger mx-1"
                                    onclick="deleteLinesTicket(`+idTicket+`)">
                                    <i class="fa-solid fa-trash-can"></i>
                                  </button> 
                                                      <!-- Btn Print   -->
                                  <a class="print btn btn-success mx-1" href="#" onclick="printTicket(`+idTicket+`); return false;">
                                    <i class="fa-solid fa-print"></i>
                                  </a>

                                </div>
                              </td>

                              <td class="text text-center border border-dark border-1 fw-bold" colspan="4">
                                <div class="d-flex flex-row justify-content-center fs-6">
                                <span>TTC</span>
                                <span class="badge text-bg-dark fs-4 mx-1" id="spanTotalTicket">`+total+`</span>
                                </div>
                              </td>                            
                            </tr>`;
 
            
  document.getElementById('tfootTicket').innerHTML=htmlFootTicket;           
        
} //displayTfootTicket



function displayTicket(idTicket){
 
  var xhr = new XMLHttpRequest();
 
  xhr.open('GET','http://localhost:8000/front/loadDataTicket.php?idTicket='+idTicket,true);

  xhr.onload = function() {

    if(xhr.status==200){

      var divTab4El = document.getElementById("divTab4");  

      if(divTab4El != null){      
        divTab4El.classList.add("border");
        divTab4El.classList.add("border-secondary");
      }       
   
      var  data =  JSON.parse(this.response);
            
      var idUser = data[0].idUser;

      var imgUser = data[0].imgUser;

      var nameUser = data[0].nameUser;

      var nrTicket = data[0].nrTicket;

      var totalTicket = data[0].totalTicket;

      var html = ` <caption class="fs-6 fw-bold mx-1" id="captionLineTicket">
                            <div class="text text-center fs-6 fw-bold">                     
                              <span>Ticket Nr:
                                <span class="badge text-bg-dark fw-bold fs-6" id="spanNrTicket">`+nrTicket+`</span>
                              </span>                           
                            </div>               
                          </caption>   
                          <thead id="theadTicket">
                          </thead>  
                          <tbody id="tbodyTicket"    class="tbodyTicket">
                          </tbody>
                          <tfoot id="tfootTicket">
                          </tfoot>      
                        `;

      document.getElementById("idTable4").innerHTML = html;      

      displayTheadTicket(idUser,idTicket);

      console.log('>1775 data :',data)

      data = data.slice(1); // Remove the first element which contains ticket info .

      console.log('>1779 data after slice(1) :',data)
      console.log('>1780 data',imgUser);      
                                                      
      if(data.length > 0){ 

        min['lignes_ticket'] = data[0].id_ligne_ticket;
        max['lignes_ticket'] = data[data.length-1].id_ligne_ticket;

        data.forEach( element => {

        var dataTicket = {
                        idLigneTicket : element.id_ligne_ticket,
                        idTicket      : element.id_ticket,
                        idProduct     : element.id_product,                              
                        imgSrc        : element.img_product,
                        indexRow      : element.index_row,                        //element.indexRowTicket,
                        nameProduct   : element.name_product,
                        quantity      : element.quantity,
                        price         : element.price                 
                        }

        displayTbodyTicket(dataTicket); }); //forEach
     
      }else{
        document.getElementById('tbodyTicket').innerHTML = "";
      } 

      displayTfootTicket(idTicket,totalTicket);
            
      removeRedProductsInTable5(idTicket);
      RedProductsInTable5(idTicket);

      //display user's photo       
      if(imgUser == ''){
        imgUser = 'default_employe.png';
      }

      document.getElementById("idImgUser").src = "../uploads/employees/"+imgUser;
      document.getElementById("idSpanIdUser").innerText = idUser;
      document.getElementById("idSpanFirstName").innerText = nameUser;

      colorFirstRowTicket();

      //currentTable = 'lignes_ticket';

      console.log('>1786 min :',min['lignes_ticket'])
      console.log('>1787 max :',max['lignes_ticket'])      
      
    }//status==200 =================( end status function displayTicket)==================================

  }//xhr.onload 

  xhr.send();

}//displayTicket  


function addSingleProductInTicket(idUser,idTicket,idProduct){

  var xhr = new XMLHttpRequest();
                                                                        
  xhr.open('GET','http://localhost:8000/front/addProductToTicket.php?idUser='+idUser+'&idTicket='+idTicket+'&idProduct='+idProduct,true);
  
  xhr.onload = function() {

    if(xhr.status==200){

      var  data =  JSON.parse(this.response);
      
      console.log('1876 data  add product :'+data);

      //========================================
      var dataTicket = {
                        idLigneTicket : data.idLigneTicket,
                        idTicket      : data.idTicket,
                        idProduct     : data.idProduct,                              
                        imgSrc        : data.imgSrc,
                        index         : data.indexRow,
                        nameProduct   : data.nameProduct,
                        quantity      : data.quantity,
                        price         : data.price                 
                        }

      displayTbodyTicket(dataTicket);  //forEach

      const rows = document.querySelectorAll(".trTbodyTicket");
      Array.from(rows).forEach(row => {
          row.classList.remove("bg-success");
      });
      document.querySelector("#trTbodyTicket"+String(data.idLigneTicket)).classList.add("bg-success");

      redAddedIndexProductTable5(data.idProduct,data.indexRow);

      displayTicket(idTicket);

      colortRowTicketTable4(idProduct)
              
    }//200

  }//onload

   xhr.send();   
  
}//addSingleProductInTicket


function ChangeQuantityOrAddProduct(idUser,idTicket,idProduct){
 
 console.log('>1924 idUser', idUser)
 console.log('>1924 idTicket',idTicket)
 console.log('>1924 idProduct',idProduct)


  var xhr = new XMLHttpRequest();
                         
  xhr.open('GET','',true);

  xhr.onload = function() {

    if(xhr.status==200){

    //var  data =  JSON.parse(this.response);

    const redProducts = [];//empty object

    const rows = document.querySelectorAll('.trTbodyTicket');

    // Load all index and id product existing already in the current ticket
    // index and id as an object
    rows.forEach(row => {

          redProducts.push({     index: row.dataset.idindex, 
                             idProduct: row.dataset.idproduct });

    });//forEach

    //==============( New product ?)=================================

    const exists = redProducts.some(element => element.idProduct === String(idProduct));
    
    if(exists) {
      
     // alert('product exist !');
      colortRowTicketTable4(idProduct)
          
    } else {

      //The id_product is a new product     
      
     // var idUser = getRowUsers();

      addSingleProductInTicket(idUser,idTicket,idProduct)
                    
    }//else

    currentTable = table_name[5];
        
    }//status==200

  }//function

  xhr.send();
   
}//ChangeQuantityOrAddProduct


function removeRedProductsInTable5(idTicket){

  const rows = document.querySelectorAll("#idSpanIndexProduct")

  rows.forEach(row => {

    row.textContent = "";

    row.textContent = "";
    var classListSpan = row.classList;
    classListSpan.remove("bg-danger");

    var parentSpan = row.parentElement.classList ;
    parentSpan.remove("bg-danger");
  
  });

  
  
}//removeRedProductsInTable5

function RedProductsInTable5(idTicket){

  var xhr = new XMLHttpRequest();
  xhr.open('GET','',true);

  xhr.onload = function() {
    
    if(xhr.status==200){

    const redProducts = [];//empty object

    const rows = document.querySelectorAll('.trDetailTicketTable4');


    // Load all index and id product existing already in the current ticket
    // index and id in an object
    rows.forEach(row => {

          //console.log('row Ligne Ticket :',row,"index :",row.dataset.idindex,"productId :",row.dataset.idproduct);

          redProducts.push({     index: row.dataset.idindex, 
                             productId: row.dataset.idproduct });

    });//forEach

    redProducts.forEach( element => {

      var productCard = document.querySelector('#idSpanIndexProduct'+String(element.productId));

      if(!productCard) return;

      productCard.textContent = element.index;
      productCard.classList.add("bg-danger");
      productCard.parentElement.classList.add("bg-danger");

    })//forEach
    
    }//status==200 =========

  }//xhr.onload 

  xhr.send();

}//RedProductsInTable5

function productsInTicket(idTicket){

  var xhr = new XMLHttpRequest();
                                      
  xhr.open('GET','http://localhost:8000/loadProductsInTicket.php?idTicket='+idTicket,true);
  
  xhr.onloadend = function() {

    if(xhr.status==200){

      var  data =  JSON.parse(this.response);
      
      var firstTds = document.querySelectorAll("#tbodyProducts tr td:first-child")

      Array.from(firstTds).map(td =>
        {
          data.forEach( element => {
            if(td.parentElement.dataset.idproduct == element.id_product ){

              td.textContent = element.indexRow;
              td.classList.add('bg-danger')

            }
           
          })
          
        });
     
    }//200

  }//onload

  xhr.send();

}//productsInTicket

//============================= ( displayDetailScrollingTickets )===========================================
function displayDetailScrollingTickets(idTicket){
 
  var xhr = new XMLHttpRequest();

  
  xhr.open('GET','http://localhost:8000/front/loadDataTicket.php?idTicket='+idTicket,true);

  xhr.onload = function() {

    if(xhr.status==200){

      var divTab4El = document.getElementById("divTab4");         
      if(divTab4El != null){      
        divTab4El.classList.add("border");
        divTab4El.classList.add("border-secondary");
      }       
   
      var  data =  JSON.parse(this.response);

      var nrTicket = data[0].nrTicket;

      var totalTicket = data[0].totalTicket;      

            var html = `<caption class="fs-6 fw-bold mx-1" id="captionLineTicket">
                          <div class="text text-center fs-6 fw-bold">                     
                            <span>Ticket Nr:
                              <span class="badge text-bg-dark fw-bold fs-6">`+nrTicket+`</span>
                            </span>                           
                          </div>               
                        </caption>   
                        <thead id="theadTicket">
                        </thead>  
                        <tbody id="tbodyTicket">
                        </tbody>
                        <tfoot id="tfootTicket">
                        </tfoot>      
                       `;

      document.getElementById("idTable4").innerHTML = html;            

      displayTheadScrollTickets(idTicket);
                                                        
      data = data.slice(1); // Remove the first element which contains ticket info .

      if(data.length > 0){ 

        data.forEach( element => {

        var dataTicket = {
                        idLigneTicket : element.id_ligne_ticket,
                        idTicket      : element.id_ticket,
                        idProduct     : element.id_product,                              
                        imgSrc        : element.img_product,
                        index         : element.indexRow,
                        nameProduct   : element.name_product,
                        quantity      : element.quantity,
                        price         : element.price                 
                        }

        displayTbodyScrollTickets(dataTicket); }); //forEach

      }else{

        document.getElementById('tbodyTicket').innerHTML = "";

      } 

      displayTfootScrollTickets(idTicket,totalTicket);

      removeRedProductsInTable5(idTicket)
      RedProductsInTable5(idTicket);

      colorRowTickets(idTicket);
            
    }//status==200 =================( end status function displayTicket)==================================

  }//xhr.onload 

  xhr.send();

}//displayDetailScrollingTickets  


//========================================================================
function displayTheadScrollTickets(idTicket){

  //============( theadTicket )================================
      var htmlTheadTicket = ` <tr id="trHeadTicket" class="border border-danger border-1 w-100"  data-idticket="`+idTicket+`"> 
                                <th class="col-3 text text-center border border-dark border-1">Image</th>
                                <th class="col-8 text text-center border border-dark border-1">Product</th>          
                                <th class="col-12 text text-center border border-dark border-1">Qu.</th> 
                                <th class="col-10 text text-center border border-dark border-1">Prix</th> 
                                <th class="col-10 text text-center border border-dark border-1">Total</th>                             
                              </tr>                                                  
                              ` ;

      document.getElementById("theadTicket").innerHTML = htmlTheadTicket ;


}//displayTheadScrollTickets

function displayTbodyScrollTickets(dataBodyTicket){
        
  var idLigneTicket = dataBodyTicket.idLigneTicket
  var      idTicket = dataBodyTicket.idTicket;
  var     idProduct = dataBodyTicket.idProduct                                   
  var        imgSrc = dataBodyTicket.imgSrc  
  var         index = dataBodyTicket.index;
  var   nameProduct = dataBodyTicket.nameProduct;
  var      quantity = dataBodyTicket.quantity;
  var         price = dataBodyTicket.price;

  var     totalItem = quantity * price;
//============================================
//=============================================
  if(imgSrc===""){
    imgSrc = "default_product.png";
  }

  var html = `<tr  id="trDetailTicket`+idLigneTicket+`" class="border border-dark border-1 w-100"
                data-idindex="`+index+`"
                data-idligneticket="`+idLigneTicket+`"
                data-idproduct="`+idProduct+`"
                data-idticket="`+idTicket+`"    onclick="rowSelected(`+idLigneTicket+`)" tabindex="0"> 
                                            
                <td class=" text text-center border border-dark border-1">
                  <img class="img img-fluid imgProduct"  
                  src="./uploads/products/`+imgSrc+`"  width="50px">                                            
                </td>

                <td class=" text text-center text-nowrap border border-dark border-1 fs-6 fw-bold">`+nameProduct+`</td>

                <td class=" text text-center border border-dark border-1"><!---Quantity------> 

                  <span id="quantity`+idLigneTicket+`" class="quantity fs-6 fw-bold py-2 my-1 mx-1">`+quantity+`</span>

                </td>

                <td class="text text-center border border-dark border-1 fs-6 fw-bold">`+price+`</td>

                <td class=" text text-center border border-dark border-1 fs-6 fw-bold">
                <span class="text text-bg-dark fs-6 mx-1" id="spanTotalItem`+idLigneTicket+`">
                `+totalItem.toFixed(2)+`
                </span>
                </td>                      
              </tr>`; 
                                                           
  document.getElementById('tbodyTicket').innerHTML += html;

}//displayTbodyScrollTickets

function displayTfootScrollTickets(idTicket,totalTicket){
    
  
 var htmlFootTicket =  ` <tr> 
                              <td class="text text-center border border-dark border-1 fs-3 fw-bold" colspan="3"> 
                              
                                <a id="aBtnChangeTicket" data-idticket=`+idTicket+` href="http://localhost:8000/front/modifTicket.php?idTicket=`+idTicket+`" class="btn mx-1">
                                <div class="badge text-bg-success fw-bold fs-4" >
                                <i class="fa-solid fa-pencil"></i>                                
                                </div>
                                </a>                                                                                     
                             
                              </td>

                              <td class="text text-center border border-dark border-1 fw-bold" colspan="4">
                                <div class="d-flex flex-row justify-content-center fs-6">
                                <span>TTC</span>
                                <span class="badge text-bg-dark fs-4 mx-1" id="spanTotalTicket">`+Number(totalTicket).toFixed(2)+`</span>
                                </div>
                              </td>                            
                            </tr>`;    
          
  document.getElementById('tfootTicket').innerHTML=htmlFootTicket;           
        
}

function readVariables(){

  console.log('currentTable :'+currentTable);
  console.log('currentSelected[table_name[3]] :'+currentSelected[table_name[3]]);
 
}

//=================( Etat Z )=================================
//        Etat Z 
//============================================================

var selectViewZ ="";

var idZ = null;


function  initKeyboardNavigationEtatZ(){
    
    document.addEventListener('keydown', (event) => {

        if (event.target && ['INPUT','TEXTAREA','SELECT'].includes(event.target.tagName)) {
        return; }

        console.log("event  : "+event.key);

        switch (event.key) { 

            case 'Home':
              event.preventDefault();
                
              colorFirstRowEtatZ();
              currentTable = 'etat_z'
            break;

            case 'Insert':  
              event.preventDefault();
              
                feedThermalPaper(1);              
            break;            
            case 'Delete':  
                event.preventDefault();

            break;                              
            case 'End':  
                event.preventDefault();  
                                
            break;                  
            case 'Escape':
                event.preventDefault();
            break;
            case 'Tab':
                event.preventDefault(); 

            break;            
            case 'PageUp':          
                event.preventDefault(); 

            break;
            case 'PageDown':
                event.preventDefault();
            break;              
            case 'ArrowUp':
                event.preventDefault(); 
                                                     
                if(currentTable == 'etat_z'){

                  var table = document.getElementById('idTable3');
                  if(table) {
                     table.innerHTML = ``;
                  }                        
                                  
                  prevIdZ = Number(getRowEtatZ());
                  
                  if(Number(prevIdZ) > Number(min['etat_z'])){                      
                    var prevIdZ = document.querySelector('#trIdz'+String(prevIdZ)).previousElementSibling.dataset.idz;                      
                  }

                  if(Number(getRowEtatZ()) == Number(min['etat_z']) ){                    
                   setRowEtatZ(Number(max['etat_z']));                                  
                  } else { 
                   setRowEtatZ(Number(prevIdZ));                     
                  }  
                  
                  offCursor_tdBtn(prevIdZ);
                } //currentTable == 'etat_z'  
             break;
            case 'ArrowDown':      
                event.preventDefault();

                if(currentTable == 'etat_z'){

                  var table = document.getElementById('idTable3');
                  if(table) {
                     table.innerHTML = ``;
                  }      
                                
                  nextIdZ = Number(getRowEtatZ());
                  
                  if(Number(nextIdZ) < Number(max['etat_z'])){
                      
                    var nextIdZ = document.querySelector('#trIdz'+String(nextIdZ)).nextElementSibling.dataset.idz;                      
                  }

                  if(Number(getRowEtatZ()) == Number(max['etat_z']) ){                    
                    setRowEtatZ(Number(min['etat_z']));
                    nextIdZ = getRowEtatZ();                                                   
                  } else { 
                    setRowEtatZ(Number(nextIdZ));                   
                  }  

                  offCursor_tdBtn(nextIdZ);
                }//currentTable == 'etat_z'                                          
            break;
            case 'ArrowRight':
              event.preventDefault();
              
            break;             
            case 'ArrowLeft':
              event.preventDefault();
             
            break;            
            case 'Enter':                  
                event.preventDefault();
              
            break;                                    
            case 'F1':
              event.preventDefault(); 
           
            break;
            case 'F2':
              event.preventDefault();
           
            break;
            case 'F3':
              event.preventDefault();
           
            break;

            case 'F4':
                event.preventDefault();                
            break;

            case 'F5':
                event.preventDefault();

            break;

            case 'F6':
                event.preventDefault();

                activateRadioButton('btnradio2');                
            break;
            
            case 'F7':
                event.preventDefault();

                activateRadioButton('btnradio3');                
            break;                            

            case 't' || 'T':
                event.preventDefault();
              
                console.log('Z Serveurs tickets')

            break;                            

            case 'p' || 'P':
                event.preventDefault();
              
                console.log('Z Serveurs produits')

            break;                                        
        
        }//switch                

    });//addEventListener()

    // Handle Mouse Pointer
    // Only rows with the green highlight use the pointer cursor on hover.
    document.addEventListener('mouseover', function(event) {
    var row = event.target.closest('tr');
    if (!row || !row.closest('tbody')) return;
    row.style.cursor = row.classList.contains('bg-success') ? 'pointer' : 'default';
    });

    document.addEventListener('mouseout', function(event) {
    var row = event.target.closest('tr');
    if (!row || !row.closest('tbody')) return;
    row.style.cursor = 'default';
    });
    
   
} //initKeyboardNavigationEtatZ()


function ZUserTickets(idZ,idUser){
  
  var xhr = new XMLHttpRequest();
                                           
  xhr.open('GET','http://localhost:8000/etatZ/loadDataTicketsServeurZ.php?idZ='+idZ+'&idUser='+idUser,true);

  xhr.onload = function() {

    var firstName ="";

    if(xhr.status==200){
        
          var  data =  JSON.parse(this.response);

           console.log('>2412 Tickets User data', data);

          var table = document.getElementById('idTable4');
          if(!table) return;      
              
          var divTab4El = document.getElementById("divTab4");         
          if(divTab4El != null){      
            divTab4El.classList.add("border");
            divTab4El.classList.add("border-secondary");
          } 
 
      document.getElementById('divTab4').classList.add("border");
      document.getElementById('divTab4').classList.add("border-secondary");

      html =  '<caption class="fw-bold fs-6 mx-1">' +
              '  <div class="text text-center fs-6 fw-bold">' +                                         
              '   <span id="idSpanNameUser" class="text-bg-primary fs-6 rounded-pill nowrap px-3 py-2"></span>' +
              '  </div> ' +               
              '</caption> ' +
              '<thead id="theadTickets">' +
              '  <tr class="border border-danger border-1 fw-bold fs-5 w-100"> '+
              '    <th scope="col" class="col-3 text text-center border border-dark border-1">IdTk </th>' +                
              '    <th scope="col" class="col-3 text text-center border border-dark border-1">NrTk </th>' +
              '    <th scope="col" class="col-3 text text-center border border-dark border-1">Time</th>' +
              '    <th scope="col" class="col-3 text text-center border border-dark border-1">Total</th>' +                                     
              '  </tr>' +
              '</thead>';

      // document.getElementById('idTable4').innerHTML = html;

      //table.innerHTML = html;   

      html += '<tbody>';         
      
      var somTickets = 0;

      data.forEach( element => {

        console.log('>2448 element :', element)

        var       idTicket = element.id_ticket  ;
                  firstName = element.first_name;                          
        var       nrTicket = element.nr_ticket ;

        var    totalTicket = element.total_ticket; 
                somTickets += Number(totalTicket);

        var         myTime = element.created_at;
        var      timeSlice = myTime.slice(11,16);                   

        html +=   '<tr id="trTicket'+idTicket+' class="trTicketTable3 border border-dark border-1 w-100"' +
                  '    data-idticket="`+idTicket+`" tabindex="0">' +
                  ' <td class="text text-center border border-dark fw-bold">'+idTicket+   '</th>' +
                  ' <td class="text text-center border border-dark fw-bold">'+nrTicket+   '</th>' + 
                  ' <td class=" text text-center border border-dark border-1">' +
                  '   <span class="quantity fs-6 fw-bold py-2 my-1 mx-1">'+timeSlice+'</span>' +
                  ' </td>' +                                                                          
                  ' <td class="text text-center border border-dark fw-bold">'+totalTicket+'</td>' +
                  '</tr>';                
      });//forEach

      html += '</tbody>' +
              '<tfoot>' +
              ' <tr>' +
              '   <td class="text text-center border border-dark" colspan="3">' +
              '      <span class="badge text-bg-dark fw-bold fs-6">Total</span>' +
              '   </td>' +
              '   <td class="text text-center border border-dark">' +
              '       <span class="text text-center text-dark fw-bold fs-6">'+Number(somTickets).toFixed(2)+'</span>' +
              '   </td>' +
              ' </tr>' +      
              '<tfoot>';

      table.innerHTML = html;   

      console.log('>2488 idz :'+idZ);
      console.log('>2489 idUser :'+idUser);
      
    }//status==200
      
    document.getElementById('idSpanNameUser').innerText=firstName;
    
  }//xhr.onload 

  xhr.send();  

}//ZUserTickets


function ZUserProducts(idz,idUser){

 

  console.log('>2484 ZUserProducts idUser :'+idUser);

}//ZUserProducts


function etatZTickets(idZ){

  var xhr = new XMLHttpRequest();

  xhr.open('GET','http://localhost:8000/etatZ/loadEtatZTickets.php?idZ='+idZ,true);
  
  xhr.onload = function() {

    if(xhr.status==200){

      var  data =  JSON.parse(this.response); 
      
    //  console.log('>2474 data',data);

    //==============================
      var divTab3El = document.getElementById("divTab3");         
      if(divTab3El != null){      
        divTab3El.classList.add("border");
        divTab3El.classList.add("border-secondary");
      } 

      var htmlTable3 = `<caption class="fw-bold fs-6 mx-1" onclick="">
                          <div class="text text-center fs-6 fw-bold">                                         
                          <span class="text-bg-primary fs-6 rounded-pill nowrap px-3 py-2">Tickets</span>
                          </div>               
                        </caption> 
                        <thead id="theadZTickets">

                        </thead>

                        <tbody id="tbodyZTickets">
                        </tbody>

                        <tfoot id="tfootZTickets">
                        </tfoot>                        
                        `;

      document.getElementById("idTable3").innerHTML = htmlTable3;      

  //============( theadTicket )================================
      var htmlTheadZTickets = ` <tr class="border border-danger border-1 fw-bold fs-5 w-100">
                                  <th scope="col" class="col-2 text text-center border border-dark border-1">IdTk</th>                
                                  <th scope="col" class="col-3 text text-center border border-dark border-1">NrTk</th>
                                  <th scope="col" class="col-3 text text-center border border-dark border-1">NameUser</th>
                                  <th scope="col" class="col-2 text text-center border border-dark border-1">Time</th>                                  
                                  <th scope="col" class="col-2 text text-center border border-dark border-1">Total</th>
                                </tr>`;
      document.getElementById("theadZTickets").innerHTML = htmlTheadZTickets ;    

      document.getElementById('tbodyZTickets').innerHTML = "";

      var totalZTickets = Number(0); 

      data.forEach( element => {

      //  console.log('>2517 element :',element);

        var idTicket = element.id_ticket;
        var nrTicket = element.nr_ticket;
        var firstName = element.first_name;

        var totalTicket = element.total_ticket; 
            totalZTickets += Number(totalTicket);

        var myTime = element.created_at;
        var timeSlice = myTime.slice(11,16);   
        
  var htmlTbodyZTickets = `<tr  id="trEtatZ`+idTicket+`" class="border border-dark border-1 w-100"                              
                                 onclick="rowSelected(`+idTicket+`)" tabindex="0"> 
                                                            
                                <td class=" text text-center border border-dark border-1">
                                  `+idTicket+`
                                </td>

                                <td class=" text text-center text-nowrap border border-dark border-1 fs-6 fw-bold">`+nrTicket+`</td>

                                <td class=" text text-center border border-dark border-1">

                                  <span class="quantity fs-6 fw-bold py-2 my-1 mx-1">`+firstName+`</span>

                                </td>

                                <td class=" text text-center border border-dark border-1">

                                  <span class="quantity fs-6 fw-bold py-2 my-1 mx-1">`+timeSlice+`</span>

                                </td>                                                                

                                <td class=" text text-center border border-dark border-1 fs-6 fw-bold">
                                <span class="text text-dark fs-6 mx-1">
                                `+Number(totalTicket).toFixed(2)+`
                                </span>
                                </td>
                      
                           </tr>`; 
                                                           
                document.getElementById('tbodyZTickets').innerHTML += htmlTbodyZTickets;        

      });//forEach
      
      document.getElementById('tbodyZTickets').innerHTML += '<tfoot id="tfootZTickets">' +
                                                            '<tr  onclick="">' +
                                                              '<td class="text text-center border border-dark border-1 fs-3 fw-bold" colspan="3"> ' +
                                                              '</td>' +
                                                              '<td class="text text-center border border-dark border-1 fs-3 fw-bold"> ' +
                                                              '<span>TTC</span>' +
                                                              '</td>' + 
                                                              '<td class="text text-center border border-dark border-1 fw-bold" colspan="2">' +
                                                                '<div class="d-flex flex-row justify-content-center fs-6">' + 
                                                                '<span class="text text-bg-dark fs-4 mx-1">'+Number(totalZTickets).toFixed(2)+'</span>' +                                                                
                                                                '</div>' +
                                                              '</td>' +
                                                            '</tr>' +
                                                            '</tfoot>';


            
    }//200

  }//onload
   xhr.send(); 

}//etatZTickets  

function etatZServeurs(idZ){

  var xhr = new XMLHttpRequest();

  xhr.open('GET','http://localhost:8000/etatZ/loadEtatZServeurs.php?idZ='+idZ,true);
  
  xhr.onload = function() {

    if(xhr.status==200){

    var  data =  JSON.parse(this.response);

    console.log('>2598 data:',data)

    var table = document.getElementById('idTable3');
    if(!table) return;      
        
    var divTab3El = document.getElementById("divTab3");         
    if(divTab3El != null){      
      divTab3El.classList.add("border");
      divTab3El.classList.add("border-secondary");
    } 
              
      
    var html = `<caption class="fs-6 fw-bold mx-1" onclick="console.log('etatZServeurs')">
                  <div class="d-flex d-row justify-content-center align-items-center gap-4 fs-6 fw-bold"> 
                    <span class="text-bg-dark fs-6 rounded-pill nowrap px-3 py-2">Z Nr `+idZ+`</span>                                       
                    <span class="text-bg-primary fs-6 rounded-pill nowrap px-3 py-2">Serveurs</span>
                  </div>               
                </caption> `;
      
      html += '<thead>' +
                '<tr class="border border-dark border-1 w-100">'+
                  '<th class="col-1 text text-center border border-dark border-1">Id</th>' +      
                  '<th class="col-4 text text-center border border-dark border-1">Nom</th>' +
                  '<th class="col-4 text text-center border border-dark border-1">total</th>' +                     
                  '<th class="col-3 text text-center border border-dark border-1" colspan="2">Action</th>' +
                '</tr>' +
              '</thead>';

      html += '<tbody id="tbodyEtatZUsers">'; 
      
      var TotalZUsers = Number(0);

      data.forEach( user => {

      console.log('>2681 user:', user)

      var idUser    = user.idUser;
      var firstName = user.firstName;
      var totalUser = user.somUser;
          TotalZUsers += Number(totalUser);

      html+='<tr id="trUser'+idUser+'" class="trUser border border-dark fw-bold"' +
            '    data-iduser ='+idUser+' data-idz =' + idZ +
            '    onclick="" tabindex="0">' +
            '  <td class=" text text-center border border-dark border-1 fs-6 fw-bold">'+idUser+'</td> ' +                          
            '  <td class=" text text-start border border-dark border-1 fs-6 fw-bold">'+firstName+'</td> ' +
            '  <td class=" text text-center border border-dark border-1 fs-6 fw-bold">'+Number(totalUser).toFixed(2)+'</td> ' +
            '  <td class="text text-center border border-dark fw-bold" colspan="3">' +
            '   <div class="d-flex flex-row justify-content-center fs-6 gap-1"> ' +                
            '    <div><button id="tdBtnT'+idZ+'"  class="btn tdBtn btn-warning btn-sm" onclick="ZUserTickets('+idZ+','+idUser+')">Tickets</button></div>' +            
            '    <div><button id="tdBtnP'+idZ+'"  class="btn tdBtn btn-info    btn-sm" onclick="ZUserProducts('+idZ+','+idUser+')">Produits</button></div>' +
            '   </div>' +              
            '  </td>' +            
            '</tr> ';            
      });
      
      html += '</tbody>';

      html += '<tfoot id="tfootEtatZUsers" onclick="">' +
                '<tr class="border border-dark border-1 w-100">' +                
                  '<th class="col-1 text text-center border border-dark border-1" colspan="2">Total</th>' +
                  '<th class="col-1 text text-center border border-dark border-1">'+Number(TotalZUsers).toFixed(2)+'</th>' + 
                  '<td class="text text-center border border-dark" colspan="2">'  +              
                  '</td>' +                                        
                '</tr>' +
              '</tfoot>';

      table.innerHTML = html;      
      
    }//status==200  

  }//xhr.onload

  xhr.send();   

console.log('>2665 etatZServeurs idZ :',idZ);
}//etatZServeurs


function etatZProduits(idZ){
 
  var xhr = new XMLHttpRequest();

  xhr.open('GET','http://localhost:8000/etatZ/loadEtatZProducts.php?idZ='+idZ,true);
  
  xhr.onload = function() {

    if(xhr.status==200){

    var data = JSON.parse(this.response);

    console.log('>2738 data', data )

    var table = document.getElementById('idTable3');
    if(!table) return;      
      
  //  console.log(data);

  
    //==============================
      var divTab3El = document.getElementById("divTab3");         
      if(divTab3El != null){      
        divTab3El.classList.add("border");
        divTab3El.classList.add("border-secondary");
      } 

      var somSomCategories = data[0].somSomCategories

      var html = `<caption class="products-caption fw-bold fs-6 mx-1">
                        <div class="d-flex flex-row justify-content-between mx-4 fs-6 gap-1 w-75">                 
                        <span class="text-bg-primary fs-6 rounded-pill nowrap px-3 py-2">Produits</span>
                        <span class="text-bg-primary fs-6 rounded-pill nowrap px-3 py-2">`+Number(somSomCategories).toFixed(2)+`</span>
                        </div>               
                  </caption> `;

      html += '<tbody id="tbodyProducts">';

      var currentCategory = null; 
      
      data.forEach( product => {

        console.log(product)

        if(product.nameCategory !== currentCategory){

            currentCategory = product.nameCategory;            
          var totalCategory = product.somCategory;
      
          html += '<tr class="category-row text-light">'+
                      '<th colspan="4">' + currentCategory + '</th>' +
                      '<th colspan="4">' + Number(totalCategory).toFixed(2) + '</th>' +
                  ' </tr>';
        }

        html += '<tr>';

        html += '<td class="text text-start">'+
                      '<h5 class="text-nowrap"><span class="text fw-bold px-3">' + product.nameProduct + '</span></h5>'+
                '</td>';

        html += '<td>'+
                      '<h5 class="text-nowrap"><span class="text fw-bold px-3">' + product.price + '</span></h5>'+
                '</td>';                

        html += '<td>'+
                      '<h5 class="text-nowrap"><span class="text fw-bold px-3">' + product.quantity + '</span></h5>'+
                '</td>';                                

        html += '<td>'+
                      '<h5 class="text-nowrap"><span class="text fw-bold px-3">' + product.somProduct + '</span></h5>'+
                '</td>';                                                
                                           
        html += '</tr>';
              
      });
      
      html += '</tbody>';

      table.innerHTML = html;      
    
                                    
    }//200
  }//onload
   xhr.send(); 

}//etatZProduits

function offCursor_tdBtn(idZ){

  //off cursor from all btns in display Z
  const rows = document.querySelectorAll(".tdBtn")
  rows.forEach(row => {
    row.style.cursor = 'default';
  })

  //Keep only the btns on selected row with the cursor pointer 
  document.querySelector("#tdBtnT"+idZ).style.cursor = 'pointer';
  document.querySelector("#tdBtnS"+idZ).style.cursor = 'pointer';
  document.querySelector("#tdBtnP"+idZ).style.cursor = 'pointer';
}


function selectThisRow(idZ){

  const rows = document.querySelectorAll('.trIdz');

  rows.forEach( row => {

    row.classList.remove('bg-success');

  });

  document.querySelector("#trIdz"+idZ).classList.add('bg-success');

  offCursor_tdBtn(idZ);

  console.log('>2828 rows:',rows);
  console.log('>2826 thisRow : ',idZ);

}


function ZTickets(idZ,idUser){

  if(Number(idZ) != Number(getRowEtatZ())){
  selectThisRow(idZ)} ;

  etatZTickets(idZ,idUser);

}

function ZServeurs(idZ){

  if(Number(idZ) != Number(getRowEtatZ())){
  selectThisRow(idZ)} ;

  etatZServeurs(idZ);
}

function ZProduits(idZ){

  if(Number(idZ) != Number(getRowEtatZ())){
  selectThisRow(idZ)} ;

  etatZProduits(idZ); 
}


function displayEtatZ(){

  var xhr = new XMLHttpRequest();
                                        
  xhr.open('GET','http://localhost:8000/etatZ/loadDataEtatZ.php',true);
  
  xhr.onload = function() {

    var idz = null;

    if(xhr.status==200){

      var data = JSON.parse(this.response);

      min['etat_z'] = data[0].id_z;
      max['etat_z'] = data[data.length-1].id_z;

      console.log('>2940 data',data);
      console.log('>2941 min :',min['etat_z']);
      console.log('>2942 max :',max['etat_z']);


      var divTab2El = document.getElementById("divTab2");
      if( divTab2El != null){
        divTab2El.classList.add("border");
        divTab2El.classList.add("border-secondary");        
      } 
      
      var table = document.getElementById("idTable2");

      html = '<caption class=" text text-center fs-6 fw-bold mx-1"  onclick="console.log(\'displayEtatZ\')">Etat Z </caption>' +                                   
             '<thead id="theadEtatZ">' +
             '  <tr class="border border-danger border-1 w-100">' +
             '    <th class="col-1 text text-center border border-dark border-1">IdZ</th>' +       
             '    <th class="col-1 text text-center border border-dark border-1">Debut</th>' +
             '    <th class="col-1 text text-center border border-dark border-1">Fin</th>' +                         
             '    <th class="col-1 text text-center border border-dark border-1">total</th>' +
             '    <th class="col-1 text text-center border border-dark border-1" colspan="3">Action</th>' +                     
             '  </tr>'+           
             '</thead>' +                
             '<tbody id="tbodyEtatZ">';

      var           idz = null;

      var somEtatZ = Number(0);
  
      data.forEach( element => {

         console.log('>2896 element :', element);

                      idZ = element.id_z;
        var idTicketDebut = element.id_ticket_debut;
        var   idTicketFin = element.id_ticket_fin;

        var  totalTickets = element.totalTickets;
                somEtatZ += Number(totalTickets);

        html += '<tr id="trIdz'+idZ+'" class="trIdz border border-dark fw-bold"' +
                '    data-idz ='+idZ+' onclick="selectThisRow('+idZ+')" tabindex="0">' +
                '  <td class=" text text-center border border-dark border-1 fs-6 fw-bold">'+idZ+'</td>' +
                '  <td class=" text text-nowrap text-center border border-dark border-1 fs-6 fw-bold">'+idTicketDebut+'</td>' +
                '  <td class=" text text-nowrap text-center border border-dark border-1 fs-6 fw-bold">'+idTicketFin+'</td>' +
                '  <td class=" text text-nowrap text-center border border-dark border-1 fs-6 fw-bold">'+totalTickets+'</td>' +
                '  <td class="text text-center border border-dark fw-bold" colspan="3">' +
                '   <div class="d-flex flex-row justify-content-center fs-6 gap-1"> ' +                
                '    <div><button id="tdBtnT'+idZ+'"  class="btn tdBtn btn-warning btn-sm" onclick="ZTickets('+idZ+')">Tickets</button></div>' +
                '    <div><button id="tdBtnS'+idZ+'"  class="btn tdBtn btn-danger  btn-sm" onclick="ZServeurs('+idZ+')">Serveurs</button></div>' +
                '    <div><button id="tdBtnP'+idZ+'"  class="btn tdBtn btn-info    btn-sm" onclick="ZProduits('+idZ+')">Produits</button></div>' +
                '   </div>' +              
                '  </td>' +
                '</tr>';                  
          
      });//forEach

     
      html += '</tbody>' +
              '<tfoot">' +
              ' <tr>' +

              '   <td class="col-1 text text-center border border-dark border-1" colspan="3" >' +
              '       <span class="badge text-bg-dark fw-bold fs-6">Total</span>' +
              '   </td>' +
              '   <td class="text text-center border border-dark">'  +
              '       <span class="badge text text-center text-bg-dark fw-bold fs-6">'+Number(somEtatZ).toFixed(2)+'</span>' +
              '   </td>' +       
              '   <td class="text text-center border border-dark" colspan="2">'  +              
              '   </td>' +                     
              ' </tr>' +
              '</tfoot>';

      table.innerHTML = html;

      colorFirstRowEtatZ();
      getRowEtatZ();
      offCursor_tdBtn(getRowEtatZ());

      //document.getElementById('tdBtn').style.cursor = 'pointer';

      currentTable = 'etat_z';

    }//200
  }//onload

   xhr.send();

}// displayEtatZ

//================================================
//================================================
//================================================

function startCashRegister(idUser){

  startTime();

  localStorage.setItem('idUser',String(idUser));
  
  displayUsers(Number(idUser));

  displayTickets(Number(idUser));


  currentTable = 'users';

  console.log('>>3059   idUser',idUser);
  
    
}//startCashRegister


//products [5]
function modifTicket(idTicket){
 
  displayTicket(idTicket);                           
  displayProducts();
  
}

function startAdmin(){

  startTime();
  
  console.log('>>3085 Ici Start Admin');

}

//currentTable = 'users';
// currentTable = 'lignes_ticket';
//================================================
//================================================
//================================================



////////////////////////////////////////////
function modelRequest(idArgument){

  var xhr = new XMLHttpRequest();

  xhr.open('GET','http://localhost:8000/modelRequest.php?idArgument='+idArgument,true);
  
  xhr.onload = function() {

    if(xhr.status==200){

      var  data =  JSON.parse(this.response);      
      //console.log('data :' + JSON.stringify(data));

      //>
      //>
      //>
      //>      
    }//200
  }//onload
   xhr.send();   
}//modelRaquest

/////////////////////( test function )///////////////////////////////////////////////////:
function testfunction(){

console.log("Ici test function !")
       
}//testfunction