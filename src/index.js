document.addEventListener('DOMContentLoaded', function() {
    function fetchDogs(){
    fetch("http://localhost:3000/pups")
    .then(resp => resp.json())
    .then(function(data) {
    //advanced method using a function to create arrays of the key names
    renderAllDogs(data)
    //render all dogs on top of page
    function renderAllDogs(dogs){
        //console.log("dogs",dogs)
        dogs.forEach(renderSingleDog)
    }
    }) //end of .then of first fetch
    }

    //function that pulls a single dog and then displays the dog(based on a cb function) based on a click event listener
    function renderSingleDog(oneDog){
        const span = document.createElement('span')
        span.innerText = oneDog.name
        document.querySelector('#dog-bar').append(span)
        span.addEventListener('click', (event) => {
            handleDogClick(event, oneDog.image, oneDog.isGoodDog, oneDog.name, oneDog.id)
        })
    }


    //function that display the current dog
    function handleDogClick(event, imgUrl, goodOrBad, dogName, dogID){
        //console.log(event.target, imgUrl, goodOrBad)
        const dogDescription = document.querySelector('#dog-info')
        dogDescription.innerHTML = ""

        const img = document.createElement('img')
        img.setAttribute('src', imgUrl)
        const h2 = document.createElement('h2')
        h2.innerText = dogName
        const button = document.createElement('button')
        button.innerText = (goodOrBad ? "Good Dog" : "Bad Dog")
        dogDescription.append(img, h2, button)
        button.addEventListener('click',(e) =>{
            updateStatus(button, goodOrBad, dogID)
        })
    }

    //function to toggle the data from true to false
    function updateStatus(button, goodOrBad, dogID){
        fetch(`http://localhost:3000/pups/${dogID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                isGoodDog: !goodOrBad
            })
        })
        .then(resp => resp.json())
        .then(function(data){
            handleDogClick(event, data.image, data.isGoodDog, data.name, data.id)
            reRenderTrueDogs()
        }
        )}

        function reRenderTrueDogs(){
            fetch("http://localhost:3000/pups")
            .then(resp => resp.json())
            .then(function(data){
                renderTrueFalseDog(data)
            })
        }

        const toggle = document.querySelector('#good-dog-filter')
        toggle.addEventListener('click', function(){
            fetch("http://localhost:3000/pups")
            .then(resp => resp.json())
            .then(function(data) {
                if(toggle.innerText === "Filter good dogs: OFF") {
                    toggle.innerText = "Filter good dogs: ON"
                    renderTrueFalseDog(data)
                } else {
                    toggle.innerText = "Filter good dogs: OFF"
                    document.querySelector('#dog-bar').innerHTML = ''
                    data.forEach(renderSingleDog)
                }
        })
        })

        //function that renders all the true dogs
        function renderTrueFalseDog(dog){
            document.querySelector('#dog-bar').innerHTML = ''

            const trueFalse = dog.filter(status => {
                return status.isGoodDog == true
            })
            trueFalse.forEach(renderStatusDog)
            }

        //function that redisplays the dog when filtered true
        function renderStatusDog(oneDog){
            const span = document.createElement('span')
            span.innerText = oneDog.name
            document.querySelector('#dog-bar').append(span)
            span.addEventListener('click', (event) => {
                handleDogClick(event, oneDog.image, oneDog.isGoodDog, oneDog.name, oneDog.id)
        })
    }       
fetchDogs()
})