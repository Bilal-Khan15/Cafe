$(document).ready(()=>{

    
    $('#orders').click(function(){
        $('#current').show();
        $('#previous').hide();
    })

    $('#items').click(function(){
        $('#previous').show();
        $('#current').hide();
    })

    $('#addItem').click(function(){
        $('.add-item-modal').show()
    })

    $('.close').click(function(e){
        $('.add-item-modal').hide()
    })

    $.get('http://localhost:3000/resource/orders',function(data){
        console.log(data)
        $.each(data.resources,function(index,item){
            console.log(item.date+'-'+item.month+'-'+item.year)
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
            htmlStr+= '<td><div><img width="150" src="./images/barcode.jpeg"></div><p>'+item.id+'</p></td>'
            htmlStr+= '<td>'+item.status+'</td>'
            htmlStr+= '<td>'+item.date+'-'+item.month+'-'+item.year+'</td>'
            
            $('#render-orders').append(htmlStr)    
        });
    })

    $.get('http://localhost:3000/resource/menu',function(data){
        console.log(data);
        $.each(data.resources,function(index,item){
            let htmlStr = '';
            htmlStr+= ' <tr><th scope="row">'+(index+1)+'</th>'
            htmlStr+= '<td>'+item.name+'</td>'
            htmlStr+= '<td >'+item.ingredients+'</td>'
            htmlStr+= '<td >$ '+item.price+'</td>'
            htmlStr+= '<td id="'+item.id+'"><button  class="del" id='+item.id+'>Delete</button></td>'
            $('#render-items').append(htmlStr)
        
        })
    })

    $(document).on('click','.del',function(e){
        $.post('http://localhost:3000/resource/deleteitem',{
            id: $(this).attr('id')
        },function(data){
            if(data.result._writeTime){
                window.location.reload()
            }
        })
    })

    let ingredients = new Array()
    $(document).on('change','#ingredient',function(){
        console.log($(this).val())
        ingredients.push($(this).val())
        console.log(ingredients)
    })
    
    let name = document.getElementById('name');
    let price = document.getElementById('price');
    
    $('#add_item').submit((e)=>{

        e.preventDefault();
        console.log('add')
        // let ingredients1 = $('#item-ingredient1').val();
        // let ingredients2 = $('#item-ingredient2').val();
        // let ingredients3 = $('#item-ingredient3').val();
        // let ingredients = [ingredients1,ingredients2,ingredients3]
        
        $.post("http://localhost:3000/resource/additem",{

                name        :    name.value,
                price       :    price.value,
                ingredients :    ingredients,    
            
        }, function(data){

            console.log(data)
            if(data.result==="Item has been added."){
                // $('#create').show()
                // setTimeout(()=>{
                //     window.location.reload();
                // },1000);
            }

        })
    })
})
