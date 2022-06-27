const btn = document.querySelector('button');

async function query() {

    const query = await fetch('http://localhost:3000/events/all', {
        mode: 'no-cors',
        method: "get",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
        }
    })

    const response = await query.json();
    console.log('>>>>', response);
}

query()



