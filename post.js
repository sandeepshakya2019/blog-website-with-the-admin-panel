<%  posts.forEach(function(post){ %>
        <ul class="list-unstyled">
          <li>
            <a href="/posts/<%=post._id%>" class="colordefined"><%=post.title%></a>
          </li>
        
         <% }) %>
         </ul>