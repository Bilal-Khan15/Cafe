$(document).ready(function(){
  $('.sidenav').sidenav();
  $('.dropdown-trigger').dropdown();
  $('select').formSelect();
var count = 0;
  for(i=0;i<6;i++){    
    var htmlStr='';
    htmlStr += '<div class="col l4 m12 s12" id="'+i+'">'
    htmlStr += '<div class="card hoverable">'
    htmlStr += '<div class="card-content">'
    htmlStr += '<span class="card-title grey-text text-darken-4">Vegan Burger</span>'
    htmlStr += '<p class="grey-text text-darken-2">Price : $12.00</p>'                        
    htmlStr += '<span class="card-title grey-text text-darken-4">Ingredients</span>'
    // htmlStr += '<p>Here is some more information about this product that is only revealed once clicked on.</p>'
    htmlStr += '<ol><li>Onion</li><li>Jalapeno</li><li>Olives</li></ol>'
    htmlStr += '<div style="margin-top:5px" id="'+i+'" class="customize">'
    htmlStr += '<label for="">Customize</label>'
    htmlStr += '<textarea id="'+i+'" class="text" rows="3" placeholder="e.g: mayo,ketchup etc."></textarea>'
    htmlStr += '</div>'
    htmlStr += '</div>'
    htmlStr += '<div class="card-action">'
    htmlStr += '<a  id="'+i+'" class="addToCart waves-effect waves-light light-blue btn"><i class="material-icons right">add_shopping_cart</i>Add To Cart</a>'
    htmlStr += '<div class="right">'
    // htmlStr += '<a class=" waves-effect waves-light light-blue btn" id="add"><i class="material-icons ">add</i></a>'
    // htmlStr += '<a class="btn-flat btn disabled" id="qty">'+count+'</a>'
    // htmlStr += '<a class=" waves-effect waves-light light-blue btn" id="sub"><i class="material-icons ">remove</i></a>'
    htmlStr += '<input placeholder="qty">'
    htmlStr += '</div>'
    htmlStr += '</div>'
    htmlStr += '</div>'   
    htmlStr += '</div>'
    $('#renderItem').append(htmlStr)
  
  }

  $('.text').keypress(function (event) {
    if (event.keyCode === 13) {
      console.log($(this).val())
      console.log($(this).attr('id'))
      let obj = {
        description: $(this).val(),
        id: $(this).attr('id'),
      }
      console.log(obj)
    }
});
  $('.addToCart').click(function(e){
    // alert($(this))
    console.log($(this).siblings('div')[0].children[0].value)  
    let obj = {
      qty: $(this).siblings('div')[0].children[0].value,
      id: $(this).attr('id'),
    }
    console.log(obj)
    
  })
});