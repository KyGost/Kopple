# Client
KyWeb is designed for use on Beaker's Hyperdrive protocol.

For each client, a new hyperdrive should be created and shared. This will serve as the data store, identification and frontend.

## Interface
The interface starts at the feed

## Functioning
The feed is a list of posts from addresses that the client has listed in [`follows`](follows.md). These posts are gathered from the [address](adress.md)es' [`feed`](feed.md) files.  
Posts are then filtered based on the address' filters (see [filters](filters.md) for more).  
After filtering, interactions are added, these are gathered from the client's [`interactions`](interactions.md), [`follows`](follows.md)' addresses' [`interactions`](interactions.md), their [`follows`](follows.md)' addresses' [`interactions`](interactions.md) and so on.  
The level of following to do is ideally set by a settings option, defaults to 3 (self, following, following, following).  

![Crawling example diagram](https://lh3.googleusercontent.com/pw/ACtC-3dIRO7vqORVtKok-LkgbemfzOLcYzOsLAp7x-7MfkyLan-vTMZ7b-2vFjOfnoEnMk1xDZ7EbVw6sW-VVCgPy9qaUkAaqx0fRe4tSJYmEQYx1sbkbsT-M20quRBw9hO-e2CQu_7u44UnJudXr9qXB91Diw=w1480-h436-no?authuser=0)
`self` would load [interactions](interactions.md) from `A`-`Z` but [feeds](feeds.md) only from `A`-`C`.
<!--stackedit_data:
eyJkaXNjdXNzaW9ucyI6eyJXSlFMTE9wRktRVVZwdGZVIjp7In
N0YXJ0IjoyNDMsImVuZCI6MjQzLCJ0ZXh0IjoiIVtDcmF3bGlu
ZyBleGFtcGxlIGRpYWdyYW1dKGh0dHBzOi8vbGgzLmdvb2dsZX
VzZXJjb250ZW50LmNvbS9wdy9BQ3RDLTNkSVJPN3ZxT+KApiJ9
fSwiY29tbWVudHMiOnsiMEdtVnR6clFlWFF1blZDdSI6eyJkaX
NjdXNzaW9uSWQiOiJXSlFMTE9wRktRVVZwdGZVIiwic3ViIjoi
Z2g6MTI1ODg4OTQiLCJ0ZXh0IjoiYGBgbWVybWFpZFxuZ3JhcG
ggVEQ7XG5cdHNlbGYtLT5BO1xuXHRzZWxmLS0+Qjtcblx0c2Vs
Zi0tPkM7XG5cdEEtLT5EO1xuXHRBLS0+RTtcblx0Qi0tPkY7XG
5cdEItLT5HO1xuXHRDLS0+SDtcblx0Qy0tPkk7XG5cdEMtLT5K
O1xuXHRELS0+Sztcblx0RC0tPkw7XG5cdEQtLT5NO1xuXHRFLS
0+Tjtcblx0RS0tPk87XG5cdEYtLT5QO1xuXHRGLS0+UTtcblx0
Ri0tPlI7XG5cdEctLT5TO1xuXHRHLS0+VDtcblx0SC0tPlU7XG
5cdEgtLT5WO1xuXHRJLS0+Vztcblx0SS0tPlg7XG5cdEotLT5Z
O1xuXHRKLS0+WjtcbmBgYCIsImNyZWF0ZWQiOjE2MDExMTk4OD
cwMzJ9fSwiaGlzdG9yeSI6Wzc0MTYyMjc4LC0xNTE4OTIyMTc3
LC0xOTE2NTQxMjg5LC03NjgwODgwNiwtMTU2MTU4MDg1NF19
-->