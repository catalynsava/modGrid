var rGrid;
var idKey;
var json;
var valueSearch;

export function Grid(pJson, pIdKey, pValueSearch){
  /**
   * creez 
   * - html element 'DIV'
   * - atribut 'selected'
   * - key pt GUID curent
   * pentru cautare alt DIV
   * pe care il intorc din functia 'asSearch'
   */
  idKey = pIdKey;
  json = pJson;
  valueSearch = pValueSearch;

  //---------------- grid -----------------
  rGrid = document.createElement('div');
  rGrid.id = 'grid';
  rGrid.className = 'container-fluid';
  let selected = document.createAttribute('selected');
  rGrid.setAttributeNode(selected);
  let key = document.createAttribute('key');
  rGrid.setAttributeNode(key);
  //                           ------------
   
  //------------- searchDiv ---------------
  let searchDiv = document.createElement('div');
  searchDiv.className = 'form-control form-group-sm mb-1';

  let textBoxSearch = document.createElement('input');
  textBoxSearch.setAttribute('type', 'text');
  textBoxSearch.className = 'form-control form-control-sm';
  textBoxSearch.id = 'txtSearch';
  textBoxSearch.setAttribute( "autocomplete", "off" );
  textBoxSearch.value = pValueSearch;
  textBoxSearch.onkeyup = () => {
    document.getElementById('detailTable').appendChild(
      populateGrid(
        searchJson(json, document.getElementById('txtSearch').value), pIdKey
      )
    );
    let tmpGrid = document.getElementById('grid');
    if(document.getElementById(tmpGrid.getAttribute('key')) !== null){
      document.getElementById(tmpGrid.getAttribute('key')).scrollIntoView();
    }
  }
  searchDiv.appendChild(textBoxSearch);
  rGrid.appendChild(searchDiv);
  //                           ------------
  //------------- scrollDiv ---------------
  let scrollDiv = document.createElement('div');
  scrollDiv.className = 'container-fluid bs-secondary-color vw-75';
  scrollDiv.style.maxHeight='81vh';
  scrollDiv.style.minHeight='50vh';
  scrollDiv.style.overflowY='auto';
  scrollDiv.id = 'scrollDiv';
  //                           ------------
  //------------- detailDiv ---------------
  let detailDiv = document.createElement('div');
  detailDiv.className = 'container-fluid';
  detailDiv.id = 'detailDiv';
  //                            ------------
  //------------- detailTable ---------------
  let table = document.createElement('table');
  table.id = 'detailTable';
  table.className = 'table table-striped table-hover';
  table.appendChild(
    populateGrid(
      searchJson(json, valueSearch), idKey
    )
  );
  //                           -------------
  detailDiv.appendChild(table);
  scrollDiv.appendChild(detailDiv);
  rGrid.appendChild(scrollDiv);
  //--
  
  return rGrid;
}

function searchJson(pJson, pValueSearch){
  return pJson.filter(
    item=>item.titular.match(pValueSearch)
  );
}

function populateGrid(pJson, pKey){
  /**
   * creez tbody
   * tr cu id html element id json
   */
  let selected = false;
  //------------- pt golire re-citire json ---------------
  if(document.getElementById('gridBody') !== null){
    document.getElementById('detailTable').removeChild(document.getElementById('gridBody'));
  }
  //                                    ------------------
  //------------- tbody  ---------------
  let tbody = document.createElement('tbody');
  tbody.id = 'gridBody';
  tbody.style.cursor = 'pointer';
  //                   ------------------
  
  let row=[];
  let i = 0;
  pJson.forEach(element=>{
    //------------- tr  ---------------
    row.push(document.createElement('tr'));
    //                   ------------------
    
    Object.keys(element).forEach(field=>{
      let cell = document.createElement('td');
      if (field.substring(0, 2) === 'id') {
        cell.style.display = 'none';
      }

      /**
       * daca grid key are set
       * daca nu grid not are set
       * cand i = 0
       */
      if (field === pKey){
        
        if(rGrid.getAttribute('key') != '' && selected === false){
          if(rGrid.getAttribute('key') === element[field]){
            row[i].className='table-primary';
            selected =true;
          }
        }
        row[i].id = element[field];
      }
      
      cell.id = `${field}_r${i}`;
      cell.innerText = element[field];

      row[i].appendChild(cell);
    });

    row[i].onclick = (e) => {
      let nod = document.getElementsByClassName('table-primary');
      if(nod.length > 0){
        nod[0].classList.remove('table-primary')  
      }
      
      let row = e.target.parentElement;
      row.className = 'table-primary';
  
      document.getElementById('grid').setAttribute('selected', row.id);
      document.getElementById('grid').setAttribute('key', row.childNodes[0].textContent);
    }

    tbody.appendChild(row[i]);
    i += 1;
  });
  //--
  if(selected === false && row.length > 0){
    rGrid.setAttribute('key', row[0].id);
    row[0].className='table-primary';
    selected = true;
  }

  return tbody;
}

export function selectRow(pKey){
  let nod = document.getElementsByClassName('table-primary');
  if(nod.length > 0){
    nod[0].classList.remove('table-primary')  
  }
  let row = document.getElementById(pKey);
  row.className = 'table-primary';
  row.scrollIntoView();
  
  document.getElementById('grid').setAttribute('selected', pKey);
  document.getElementById('grid').setAttribute('key', row.childNodes[0].textContent);
}
