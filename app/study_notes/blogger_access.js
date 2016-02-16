/**
 * Created by xiaoxiaoli on 2/15/16.
 */
var clientId = '339048773288-f3leqo429gvf6o4la18cgi8ku43p6k1d.apps.googleusercontent.com';
var apiKey = 'AIzaSyCJYQP-csp86STMc70_G_2Wuz18GhAOntM';
var scopes = 'https://www.googleapis.com/auth/plus.me';

function makeRequest() {
    var blog_name_request = gapi.client.blogger.blogs.get({
        'blogId': '6398562378207461363'
    });

    var blog_content_request = gapi.client.blogger.posts.list({
        'blogId': '6398562378207461363',
    });


    blog_name_request.then(function(response) {
        document.getElementById('blog_title').innerHTML = response.result.name;
        document.getElementById('description').innerHTML = response.result.description;
        console.log(response);
    }, function(reason) {
        console.log('Error: ' + reason.result.error.message);
    });


    blog_content_request.then(function(response) {
        var items = response.result.items;
        if(items!=undefined){
            for (var i=0;i<items.length;i++){
                var item = items[i];
                var posts = document.getElementById('results');
                var blog_item = document.createElement('div');
                var title = document.createElement('h3');
                var content = document.createElement('div')
                content.setAttribute("id", "content"+i)
                title.appendChild(document.createTextNode(item.title));
                blog_item.appendChild(title);
                blog_item.appendChild(title);
                blog_item.appendChild(content)
                posts.appendChild(blog_item);
                document.getElementById('content'+i).innerHTML = item.content;
            }
        }
        //appendResults(response.result);
        console.log(response);
    }, function(reason) {
        console.log('Error: ' + reason.result.error.message);
    });
    //https://www.googleapis.com/blogger/v3/blogs/blogId/posts
}

function init() {
    gapi.client.setApiKey(apiKey);
    window.setTimeout(checkAuth,1);
    gapi.client.load('blogger', 'v3').then(makeRequest);
}

function checkAuth() {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
}

function handleAuthResult(authResult) {
    var authorizeButton = document.getElementById('authorize-button');
    if (authResult && !authResult.error) {
        authorizeButton.style.visibility = 'hidden';
        makeApiCall();
    } else {
        authorizeButton.style.visibility = '';
        authorizeButton.onclick = handleAuthClick;
    }
}

function handleAuthClick(event) {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
    return false;
}