const searchForm=document.querySelector(".search-form");
const searchInput=document.querySelector("#search-input");

searchForm.addEventListener("submit",function(e){
	e.preventDefault();
	searchTerm=searchInput.value;
	const sortBy= document.querySelector('input[name="sortBy"]:checked').value;
	const searchLimit=document.querySelector("#limit").value;

	if(searchTerm === ""){
		showMessage("Please add a search term","alert-danger")
	}
	searchInput.value="";

	redditSearch(searchTerm,sortBy,searchLimit);
})

function showMessage(message,alert){
	const div=document.createElement("div");
	div.className= `alert ${alert}`;
	div.appendChild(document.createTextNode(message));
	const searchContainer=document.querySelector("#search-container");
	const search=document.getElementById("search");
	searchContainer.insertBefore(div,search);

	setTimeout(function(){
		document.querySelector(".alert").remove();
	},3000)
}

function redditSearch(searchTerm,sortBy,searchLimit){
	const url = `https://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${searchLimit}`;
	fetch(url)
		.then(function(response){
			return response.json();
		}).then(function(data){
			fetchData(data.data.children)
		})
}

function fetchData(results){
	// document.querySelector("#results").innerHTML="";
	const data= results.map(function(output){
		return output.data
	})
	console.log(data)
	let output="<div class='card-columns'>"
	data.forEach(function(post){
		let images= post.preview? post.preview.images[0].source.url : "https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg"
		output+=`
		<div class="card">
		    <img src="${images}" class="card-img-top" alt="...">
		    <div class="card-body">
		      <h5 class="card-title">${post.title}</h5>
		      <p class="card-text">${truncateText(post.selftext,100)}</p>
		      <a href="${post.url}" target=_blank class="btn btn-primary">Read More</a>
		    <hr>
		    <span class="badge badge-secondary">Subreddit : ${post.subreddit}</span>
		    <span class="badge badge-dark">Score : ${post.score}</span>
		    </div>
		  </div>
		`
	})
	output+="</div>";
	document.querySelector("#results").innerHTML=output
}

function truncateText(text,limit){
	const shortend= text.indexOf(" ",limit);
	if(shortend===-1){
		return text;
	}
	return text.substring(0,shortend);
}