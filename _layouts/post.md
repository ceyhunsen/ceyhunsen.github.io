---
layout: default
---

<h1>{{ page.title }}</h1>

Release date: {{ page.date | date: "%d/%m/%y" }}<br />
Last update date: {{ page.last_update }}

{{ content }}
