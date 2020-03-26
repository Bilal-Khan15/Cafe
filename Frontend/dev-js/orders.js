$(document).ready(()=>{

  let ordersArray = new Array();
  let d = new Date()
  let date = d.getDate()
  let month = d.getMonth()+1;
  let year = d.getFullYear();
  
  
    $.post('http://localhost:3000/resource/myorder',{
        user_id: localStorage.getItem('user_id')
    },function(data){
        console.log(data)
        $.each(data.resources,function(index,item){
          ordersArray.push(item)
        });
        
        let backup = ordersArray;
        let backup1= ordersArray;
        let backup2= ordersArray;
        
        const prev = backup.filter(item=>{
          return ( item.year < year ) || ( item.year == year && item.month < month ) || ( item.year == year && item.month == month && item.date < date) 
        }) 
        console.log(prev)
        const curr = backup1.filter(item=>{
          return ( item.year == year && item.month == month && item.date==date)
        }) 
        console.log(curr)
        const future = backup2.filter(item=>{
          return (item.year > year) || ( item.year == year && item.month > month) || ( item.year == year && item.month == month && item.date > date)
        }) 
        console.log(future)
        $.each(curr,function(index,item){
          console.log(item.id)

          let htmlStr = '';
          htmlStr+= ' <tr><th scope="row">'+(index+1)+'</th>'
          htmlStr+= '<td>'+item.user_id+'</td>'
          htmlStr+= '<td><ul>'
          $.each(item.items_id,function(index,item){
              htmlStr+= '<li>'+item+'</li>'                
          })
          htmlStr+= '</td>'
          htmlStr+= '<td><ul>'
          $.each(item.items_quantity,function(index,item){
              htmlStr+= '<li>'+item+'</li>'                
          })
          htmlStr+= '</td>'
          htmlStr+= '<td><ul>'
          $.each(item.customize,function(index,item){
              htmlStr+= '<li>'+item+'</li>'                
          })
          htmlStr+= '</td>'
          htmlStr+= '<td>'+item.status+'</td>'
          htmlStr+= '<td>'+item.date+'-'+item.month+'-'+item.year+'</td>'
          htmlStr+= '<td><div><img width="150" src="./images/barcode.jpeg"></div><p>'+item.id+'</p></td>'
          
          
          $('#render-items-current').append(htmlStr)    
  
        })

        $.each(prev,function(index,item){
          console.log(item)
          let htmlStr = '';
          htmlStr+= ' <tr><th scope="row">'+(index+1)+'</th>'
          htmlStr+= '<td>'+item.user_id+'</td>'
          htmlStr+= '<td><ul>'
          $.each(item.items_id,function(index,item){
              htmlStr+= '<li>'+item+'</li>'                
          })
          htmlStr+= '</td>'
          htmlStr+= '<td><ul>'
          $.each(item.items_quantity,function(index,item){
              htmlStr+= '<li>'+item+'</li>'                
          })
          htmlStr+= '</td>'
          htmlStr+= '<td><ul>'
          $.each(item.customize,function(index,item){
              htmlStr+= '<li>'+item+'</li>'                
          })
          htmlStr+= '</td>'
          htmlStr+= '<td>'+item.status+'</td>'
          htmlStr+= '<td>'+item.date+'-'+item.month+'-'+item.year+'</td>'
          htmlStr+= '<td><div><img width="150" src="./images/barcode.jpeg"></div><p>'+item.id+'</p></td></tr>'
          
          $('#render-items-previous').append(htmlStr)    
  
        })
        $.each(future,function(index,item){
          console.log(item)
          let htmlStr = '';
          htmlStr+= ' <tr><th scope="row">'+(index+1)+'</th>'
          htmlStr+= '<td>'+item.user_id+'</td>'
          htmlStr+= '<td><ul>'
          $.each(item.items_id,function(index,item){
              htmlStr+= '<li>'+item+'</li>'                
          })
          htmlStr+= '</td>'
          htmlStr+= '<td><ul>'
          $.each(item.items_quantity,function(index,item){
              htmlStr+= '<li>'+item+'</li>'                
          })
          htmlStr+= '</td>'
          htmlStr+= '<td><ul>'
          $.each(item.customize,function(index,item){
              htmlStr+= '<li>'+item+'</li>'                
          })
          htmlStr+= '</td>'
          htmlStr+= '<td>'+item.status+'</td>'
          htmlStr+= '<td>'+item.date+'-'+item.month+'-'+item.year+'</td>'
          htmlStr+= '<td><div><img width="150" src="./images/barcode.jpeg"></div><p>'+item.id+'</p></td>'

          htmlStr+= '<td><button id='+item.id+' class="del1">Delete</button></td>'
          htmlStr+= '<td><button id='+item.id+' class="change1">Change</button></td></tr>'
          
          $('#render-items-future').append(htmlStr)    
  
        })
        
    })

    $(document).on('click','.delete',function(){
      var id = $(this).attr('id')
      $.post('http://localhost:3000/resource/deleteorder',{
        id: id
      },function(data){
        console.log(data)
        if(data.result==="Targeted order has been deleted."){
          window.location.reload();
        }else{
          alert(data.resources)
        }
      })
    })
    $(document).on('click','.update',function(){
      var id = $(this).attr('id')
      $.post('http://localhost:3000/resource/deleteorder',{
        id: id
      },function(data){
        console.log(data)
        if(data.result==="Targeted order has been deleted."){
          window.location.href = "./menu.html";
        }else{
          alert(data.resources)
        }
      })
    })
    $(document).on('click','.del1',function(){
      $.post('http://localhost:3000/resource/deleteorder',{
        id: $(this).attr('id'),
      },function(data){
        console.log(data);
        if(data.result==="Targeted order has been deleted."){
          window.location.reload();
        }
      })
    })
    $(document).on('click','.change1',function(){
      $.post('http://localhost:3000/resource/deleteorder',{
        id: $(this).attr('id'),
      },function(data){
        console.log(data)
        if(data.result==="Targeted order has been deleted."){
          window.location.href = "./menu.html";
        }
      })
    })

    
      $('#c-order').click(function(){
        $('#current').show();
        $('#previous').hide();
        $('#future').hide();
      })
      $('#p-order').click(function(){
        $('#previous').show();
        $('#current').hide();
        $('#future').hide();
      })
      $('#f-order').click(function(){
        $('#future').show();
        $('#previous').hide();
        $('#current').hide();
      })
  })
  