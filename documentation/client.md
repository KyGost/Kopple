# Client
KyWeb is designed for use on Beaker's Hyperdrive protocol.

For each client, a new hyperdrive should be created and shared. This will serve as the data store, identification and frontend.

## Interface
The interface starts at the feed.
![enter image description here](https://lh3.googleusercontent.com/pw/ACtC-3cyROD5kQIlZ312SwE1eUzXQqVSdRP0KrDoyh70HiUuvGUvUI6p4FkeV0jvWmIQM-tQGnxAFrhrePNgOpnNYaUM0G6x00CUGsMF6xPSu8Nh49EUZwDcnUUbPqMvXQKcaGauNJhr7VWyD3X53pwrZskRVg=w1272-h937-no?authuser=0)

## Functioning
The feed is a list of posts from addresses that the client has listed in [`follows`](follows.md). These posts are gathered from the [address](adress.md)es' [`feed`](feed.md) files.  
Posts are then filtered based on the address' filters (see [filters](filters.md) for more).  
After filtering, interactions are added, these are gathered from the client's [`interactions`](interactions.md), [`follows`](follows.md)' addresses' [`interactions`](interactions.md), their [`follows`](follows.md)' addresses' [`interactions`](interactions.md) and so on.  
The level of following to do is ideally set by a settings option, defaults to 3 (self, following, following, following).  

![Crawling example diagram](https://lh3.googleusercontent.com/pw/ACtC-3dIRO7vqORVtKok-LkgbemfzOLcYzOsLAp7x-7MfkyLan-vTMZ7b-2vFjOfnoEnMk1xDZ7EbVw6sW-VVCgPy9qaUkAaqx0fRe4tSJYmEQYx1sbkbsT-M20quRBw9hO-e2CQu_7u44UnJudXr9qXB91Diw=w1480-h436-no?authuser=0)
`self` would load [interactions](interactions.md) from `A`-`Z` but [feeds](feeds.md) only from `A`-`C`.
<!--stackedit_data:
eyJkaXNjdXNzaW9ucyI6eyJXSlFMTE9wRktRVVZwdGZVIjp7In
N0YXJ0IjoyNDQsImVuZCI6MjQ0LCJ0ZXh0IjoiIVtDcmF3bGlu
ZyBleGFtcGxlIGRpYWdyYW1dKGh0dHBzOi8vbGgzLmdvb2dsZX
VzZXJjb250ZW50LmNvbS9wdy9BQ3RDLTNkSVJPN3ZxT+KApiJ9
LCJqTU1CWEJlTzhSZld2ZVV2Ijp7InN0YXJ0IjoxMTg5LCJlbm
QiOjE0MzgsInRleHQiOiIhW0NyYXdsaW5nIGV4YW1wbGUgZGlh
Z3JhbV0oaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY2
9tL3B3L0FDdEMtM2RJUk83dnFP4oCmIn19LCJjb21tZW50cyI6
eyIwR21WdHpyUWVYUXVuVkN1Ijp7ImRpc2N1c3Npb25JZCI6Il
dKUUxMT3BGS1FVVnB0ZlUiLCJzdWIiOiJnaDoxMjU4ODg5NCIs
InRleHQiOiJgYGBtZXJtYWlkXG5ncmFwaCBURDtcblx0c2VsZi
0tPkE7XG5cdHNlbGYtLT5CO1xuXHRzZWxmLS0+Qztcblx0QS0t
PkQ7XG5cdEEtLT5FO1xuXHRCLS0+Rjtcblx0Qi0tPkc7XG5cdE
MtLT5IO1xuXHRDLS0+STtcblx0Qy0tPko7XG5cdEQtLT5LO1xu
XHRELS0+TDtcblx0RC0tPk07XG5cdEUtLT5OO1xuXHRFLS0+Tz
tcblx0Ri0tPlA7XG5cdEYtLT5RO1xuXHRGLS0+Ujtcblx0Ry0t
PlM7XG5cdEctLT5UO1xuXHRILS0+VTtcblx0SC0tPlY7XG5cdE
ktLT5XO1xuXHRJLS0+WDtcblx0Si0tPlk7XG5cdEotLT5aO1xu
YGBgIiwiY3JlYXRlZCI6MTYwMTExOTg4NzAzMn0sImdvMUhwSk
lEVG1Sb2pJcHciOnsiZGlzY3Vzc2lvbklkIjoiak1NQlhCZU84
UmZXdmVVdiIsInN1YiI6ImdoOjEyNTg4ODk0IiwidGV4dCI6Im
dyYXBoIFREOyBzZWxmLS0+QTsgc2VsZi0tPkI7IHNlbGYtLT5D
OyBBLS0+RDsgQS0tPkU7IEItLT5GOyBCLS0+RzsgQy0tPkg7IE
MtLT5JOyBDLS0+SjsgRC0tPks7IEQtLT5MOyBELS0+TTsgRS0t
Pk47IEUtLT5POyBGLS0+UDsgRi0tPlE7IEYtLT5SOyBHLS0+Uz
sgRy0tPlQ7IEgtLT5VOyBILS0+VjsgSS0tPlc7IEktLT5YOyBK
LS0+WTsgSi0tPlo7IiwiY3JlYXRlZCI6MTYwMTEyMjA0OTQwNH
19LCJoaXN0b3J5IjpbNDEzMTQyNzA1LDc0MTYyMjc4LC0xNTE4
OTIyMTc3LC0xOTE2NTQxMjg5LC03NjgwODgwNiwtMTU2MTU4MD
g1NF19
-->