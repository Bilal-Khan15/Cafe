$(document).ready(()=>{
          
    let type = localStorage.getItem('type')
    console.log(type)
     if(type==="admin"||type==="caterer"){
          $('#dashboard').show()
          $('#showmore').hide()
     }
     if(type==="employee"){
          $('#orders').show()
     }

     $('#logout').click(()=>{
          localStorage.removeItem('user_id')
          localStorage.removeItem('type')
          window.location.href='./Authentication.html';
     })
     $('#showmore').click((e)=>{
          window.location.href="menu.html";
     })

})
