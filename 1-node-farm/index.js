const fs = require('fs');
const http = require('http');
const url = require('url');



//////////////////////////////////////////////
//FilesSystem
// Blocking, synchronous way
// const textIn = fs.readFileSync('./starter/txt/input.txt','utf-8');
// console.log(textIn);
// const textOut = `This is what we know about is avacado: ${textIn}.\nCreated on ${Date.now()} `;
// fs.writeFileSync('./starter/txt/output.txt' , textOut);
// console.log('The file written');

//Non-Blocking, Asynchronous way

// fs.readFile("./starter/txt/start.txt", "utf-8", (err, data1) => {
//     if(err) return console.log('ERROR! 😄') 
//   fs.readFile(`./starter/txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./starter/txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile(
//         "./starter/txt/final.txt",
//         `${data2}\n${data3}`,
//         "utf-8",
//         (err) => {
//           console.log("Your file has been written 😄");
//         }
//       );
//     });
//   });
// });
// console.log("will read file");


/////////////////////////////////////////////
//SERVER
// ye bahir humny is liye likha k isko br br read 
// na krna pary browser isse br br na dhondy.
//or agr ham isse andr likhty or sync use krty
//tou ye problem krta or agr hamary ps multiples
//mn request hoti tou ye isse block krdeta 
const replaceTemplate = (temp , product) =>{
    let output = temp.replace(/{%PRODUCTNAME%}/g,product.productName);
    output = output.replace(/{%IMAGE%}/g,product.image);
    output = output.replace(/{%PRICE%}/g,product.price);
    output = output.replace(/{%FROM%}/g,product.from);
    output = output.replace(/{%NUTRIENTS%}/g,product.nutrients);
    output = output.replace(/{%QUANTITY%}/g,product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g,product.description);
    output = output.replace(/{%ID%}/g,product.id);

if(!product.organic) output.replace(/{%NOT_ORGANIC%}/g , 'not-organic')
return output;
    }
const tempOverview =fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`,'utf-8');
const tempCard =fs.readFileSync(`${__dirname}/starter/templates/template-card.html`,'utf-8');
const tempProduct =fs.readFileSync(`${__dirname}/starter/templates/template-product.html`,'utf-8');
 
const data =fs.readFileSync(`${__dirname}/starter/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);



const server = http.createServer((req , res)=>{
// console.log(req.url);
const {query , pathname} = url.parse(req.url,true);
    //  const pathname = req.url;
    //  console.log(pathname);


     // Overview page
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200 , {'Content-type' : 'text/html'});
       const cardsHtml =  dataObj.map(el => replaceTemplate(tempCard , el)).join('');
       const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);
        // console.log(cardsHtml)
        
        res.end(output);
    }
    //Product page
    else if(pathname ==="/product"){
        res.writeHead(200 , {'Content-type' : 'text/html'});
      const product = dataObj[query.id];
      const output = replaceTemplate(tempProduct , product);
        res.end(output);
    }
    //API 
    else if(pathname ==='/api'){
          res.writeHead(200 , {'Content-type' : 'application/json'});
          res.end(data);
    }
    //Not found
    else{
        res.writeHead(404 , {
            'Content-type' : 'text/html',
            'my-own-header' : 'hello-world'
        });
        res.end('<h1>page not found!</h1>');
    }

    res.end('Hello from the server!');
}); 

server.listen(5000 , '127.0.0.1' ,()=>{
    console.log('Listening to request on port 5000')
});
