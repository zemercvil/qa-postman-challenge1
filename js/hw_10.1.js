var arr = [
    {
        userName:"Test",
        lastName:"Test",
        email:"test.test@gmail.com"
    },
    {
        userName:"Dmitro",
        lastName:"Porohov",
        email:"dmitro.porohov@yahoo.com" //є підозра, що <email:"dmitro.porohov@yahoo.com> - це одруківка, тож я прибрала "<>"
    },
    {
        userName:"Andrii",
        lastName:"",
        email:"andrii@mail.ru" // Нам такі не підходять
    },
];

const pattern = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)?@(gmail|yahoo)\.com$/;

function checkEmail(arr) {
    let trustedEmails = [];
    for (let user of arr) 
        if (pattern.test(user.email)) {
            trustedEmails.push(user.email);
        }
    return trustedEmails;


}
console.log(checkEmail(arr));