# Client
KyWeb is designed for use on Beaker's Hyperdrive protocol.

For each client, a new hyperdrive should be created and shared. This will serve as the data store, identification and frontend.

## Interface
The interface starts at the feed. The feed is a list of posts from addresses that the client has listed in [`follows`](follows.md). These posts are gathered from the [address](adress.md)es' [`feed`](feed.md) files.  
Posts are then filtered based on the address' filters (see [filters](filters.md) for more).  
After filtering, interactions are added, these are gathered from the client's [`interactions`](interactions.md), [`follows`](follows.md)' addresses' [`interactions`](interactions.md), their [`follows`](follows.md)' addresses' [`interactions`](interactions.md) and so on.  
The level of following to do is ideally set by a settings option, defaults to 3 (self, following, following, following).  

![Crawling example diagram](https://lh3.googleusercontent.com/pw/ACtC-3dIRO7vqORVtKok-LkgbemfzOLcYzOsLAp7x-7MfkyLan-vTMZ7b-2vFjOfnoEnMk1xDZ7EbVw6sW-VVCgPy9qaUkAaqx0fRe4tSJYmEQYx1sbkbsT-M20quRBw9hO-e2CQu_7u44UnJudXr9qXB91Diw=w1480-h436-no?authuser=0)
`self` would load [interactions](interactions.md) from `A`-`Z` but [feeds](feeds.md) only from `A`-`C`.

## Functioning
<!--stackedit_data:
eyJkaXNjdXNzaW9ucyI6eyJXSlFMTE9wRktRVVZwdGZVIjp7In
N0YXJ0Ijo5MTksImVuZCI6MTE2OCwidGV4dCI6IiFbQ3Jhd2xp
bmcgZXhhbXBsZSBkaWFncmFtXShodHRwczovL2xoMy5nb29nbG
V1c2VyY29udGVudC5jb20vcHcvQUN0Qy0zZElSTzd2cU/igKYi
fX0sImNvbW1lbnRzIjp7IjBHbVZ0enJRZVhRdW5WQ3UiOnsiZG
lzY3Vzc2lvbklkIjoiV0pRTExPcEZLUVVWcHRmVSIsInN1YiI6
ImdoOjEyNTg4ODk0IiwidGV4dCI6ImBgYG1lcm1haWRcbmdyYX
BoIFREO1xuXHRzZWxmLS0+QTtcblx0c2VsZi0tPkI7XG5cdHNl
bGYtLT5DO1xuXHRBLS0+RDtcblx0QS0tPkU7XG5cdEItLT5GO1
xuXHRCLS0+Rztcblx0Qy0tPkg7XG5cdEMtLT5JO1xuXHRDLS0+
Sjtcblx0RC0tPks7XG5cdEQtLT5MO1xuXHRELS0+TTtcblx0RS
0tPk47XG5cdEUtLT5PO1xuXHRGLS0+UDtcblx0Ri0tPlE7XG5c
dEYtLT5SO1xuXHRHLS0+Uztcblx0Ry0tPlQ7XG5cdEgtLT5VO1
xuXHRILS0+Vjtcblx0SS0tPlc7XG5cdEktLT5YO1xuXHRKLS0+
WTtcblx0Si0tPlo7XG5gYGAiLCJjcmVhdGVkIjoxNjAxMTE5OD
g3MDMyfX0sImhpc3RvcnkiOlstMTUxODkyMjE3NywtMTkxNjU0
MTI4OSwtNzY4MDg4MDYsLTE1NjE1ODA4NTRdfQ==
-->