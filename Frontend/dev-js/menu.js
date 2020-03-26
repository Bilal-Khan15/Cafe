$(document).ready(()=>{

    $.get('http://localhost:3000/resource/menu',function(data){
        console.log(data);
        $.each(data.resources,function(index,item){
            let htmlStr = '';
            htmlStr += '<div class="col-md-12 col-lg-6 col-xl-3 mt-4" id='+index+'>';
            htmlStr += '<div class="card">'
            htmlStr += '<div class="card-body">'
            htmlStr += '<h3>'+item.name+'</h3>'
            htmlStr += '<h4>$ '+item.price+'</h4>'
            htmlStr += '<h5>Ingredients</h5>'
            htmlStr += '<ul>'
            $.each(item.ingredients,function(index,item){
                htmlStr += '<li>'+item+'</li>'
            })
            htmlStr += '</ul>'
            htmlStr += '<input id='+item.id+' class="form-control mt-2" placeholder="Quantity" type="number">'
            htmlStr += '<input id='+item.id+' class="form-control mt-2" placeholder="e.g: mayo, ketchup etc" id="customize">'
            htmlStr += '<button id='+item.id+' name='+item.name+' value='+item.price+' class="btn btn-primary add-to-cart mt-2" style="width:100%;"><i class="fa fa-cart-plus" aria-hidden="true"></i>Add To Cart</button></div>'                
            htmlStr += '</div>'
            htmlStr += '</div>'
            htmlStr += '</div>'
            
            $('#renderMenu').append(htmlStr)
        
        })
    })

    let order = new Array();
    $(document).on('click','.add-to-cart',function(){

        var name = $(this).attr('name')
        var price = $(this).attr('value')
        var id = $(this).attr('id')
        var customize = $(this).prev().val()
        var qty = $(this).prev().prev().val()
        if(qty===''||qty===null){
            qty = 0
        }
        const packet = {
            id: id,
            name: name,
            price: price,
            qty: qty,
            customize: customize
        }
        console.log(packet)
        order.push(packet)
        console.log(order)
    })

    $('.checkout').click(function(){
        
        let backup = order;
        $.each(backup,function(index,item){
            let htmlStr = '';
            htmlStr+= ' <tr><th scope="row">'+(index+1)+'</th>'
            htmlStr+= '<td>'+item.name+'</td>'
            htmlStr+= '<td>$ '+item.qty+'</td>'
            htmlStr+= '<td>'+item.price+'</td>'
            htmlStr+= '<td>$ '+(item.qty * item.price)+'</td></tr>'
            $('#render-items').append(htmlStr)    
        })
        $('#billModal').show()
    })

    $('.close').click(function(){
        $('#billModal').hide()        
    })
    

    let date='',month='',year='';
    $(document).on('change','input[type="date"]',function(){
        console.log($(this).val())
        let fullDate = $(this).val()
        year  = fullDate[0]+fullDate[1]+fullDate[2]+fullDate[3]
        if(fullDate[5]=='0'||fullDate[5]==0){
            month = fullDate[6]
        }else{
            month = fullDate[5]+fullDate[6]
        }
        // if(fullDate[8]=='0'||fullDate[8]==0){
        //     date  = fullDate[9]
        // }else{
            date  = fullDate[8]+fullDate[9]
        // }
    })

    $('#OK').click(function(){
        let user_id = localStorage.getItem('user_id');
        let items_id = new Array();
        let items_quantity = new Array();
        let customize = new Array();
        let backup = order;
        $.each(backup,function(index,item){
            items_id.push(item.id)
            items_quantity.push(item.qty)
            customize.push(item.customize)
        })
        if(date!==''&&month!==''&&year!==''){
            $.post('http://localhost:3000/resource/addorder',{
                user_id: user_id,
                items_id: items_id,
                items_quantity: items_quantity,
                customize: customize,
                date: date,
                month: month,
                year: year
            },function(data){
                if(data.result==="Order has been added."){
                    $('#create').show()
                    setTimeout(()=>{
                        window.location.href = 'Orders.html';
                    },1500)
                }
            })
    
        }
        else{
            alert('Please Mention the Date');
        }
    })

    
        
})
