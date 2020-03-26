$(document).ready(function(){
    
    $('#authenticate').submit(e =>{
        e.preventDefault()
//        alert('Authneticate')
        $('#loading').show()
        let authUser = $('#authUser').val()
        let authPass = $('#authPass').val()

        link = "http://localhost:3000/user/signin"
        let signIn = {
            url : "http://localhost:3000/user/signin",
            method: 'POST',
            body:{
                UserName: authUser,
                Password: authPass
            }
        }
        $.post("http://localhost:3000/user/signin",{
            UserName: authUser,
            Password: authPass
        }, function(data){
            if(data.resources){
                console.log(data)
                var type = data.resources[0].type
                var id = data.resources[0].id
                localStorage.setItem('user_id',id)
                localStorage.setItem('type',type)
                setTimeout(function(){
                    window.location.href = "index.html"
                },1500);    
            }
        })
    })
    
    $('#signUp').submit(e =>{
        e.preventDefault()
//        alert('Authneticate')
        let user = $('#user').val()
        let pass = $('#pass').val()
        let repass = $('#re-pass').val()
        let email = $('#email').val()
        let companyName = $('#companyName').val()
        let companyID = $('#companyId').val()
        let type = $('#type').val()
        
        $.post("http://localhost:3000/user/signup",{
            UserName: user,
            type: type,
            Email: email,
            Password: pass,
            CompanyName: companyName,
            CompanyId: companyID,
        }, function(data){
            
            if(data.result){
                $('#create').show()
                setTimeout(function(){
                    window.location.reload()
                },1500);    
            }
    
        })
    })
    
    
})