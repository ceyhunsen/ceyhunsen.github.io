---
layout: default
---

<h1>{{ page.title }}</h1>

<p>Release: {{ page.date | date: "%d/%m/%y" }}</p>
<p>Last update: {{ page.last_update }}</p>

{{ content }}
