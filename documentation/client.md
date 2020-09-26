# Client
KyWeb is designed for use on Beaker's Hyperdrive protocol.

For each client, a new hyperdrive should be created and shared. This will serve as the data store, identification and frontend.

## Interface
The interface starts at the feed.
![Example interface](https://lh3.googleusercontent.com/pw/ACtC-3cyROD5kQIlZ312SwE1eUzXQqVSdRP0KrDoyh70HiUuvGUvUI6p4FkeV0jvWmIQM-tQGnxAFrhrePNgOpnNYaUM0G6x00CUGsMF6xPSu8Nh49EUZwDcnUUbPqMvXQKcaGauNJhr7VWyD3X53pwrZskRVg=w1272-h937-no?authuser=0)

## Functioning
The feed is a list of posts from addresses that the client has listed in [`follows`](follows.md). These posts are gathered from the [address](adress.md)es' [`feed`](feed.md) files.  
Posts are then filtered based on the address' filters (see [filters](filters.md) for more).  
After filtering, interactions are added, these are gathered from the client's [`interactions`](interactions.md), [`follows`](follows.md)' addresses' [`interactions`](interactions.md), their [`follows`](follows.md)' addresses' [`interactions`](interactions.md) and so on.  
The level of following to do is ideally set by a settings option, defaults to 3 (self, following, following, following).  

![Crawling example diagram](https://lh3.googleusercontent.com/pw/ACtC-3dIRO7vqORVtKok-LkgbemfzOLcYzOsLAp7x-7MfkyLan-vTMZ7b-2vFjOfnoEnMk1xDZ7EbVw6sW-VVCgPy9qaUkAaqx0fRe4tSJYmEQYx1sbkbsT-M20quRBw9hO-e2CQu_7u44UnJudXr9qXB91Diw=w1480-h436-no?authuser=0)
`self` would load [interactions](interactions.md) from `A`-`Z` but [feeds](feeds.md) only from `A`-`C`.
<!--stackedit_data:
eyJkaXNjdXNzaW9ucyI6eyJqTU1CWEJlTzhSZld2ZVV2Ijp7In
N0YXJ0IjoxMTc4LCJlbmQiOjE0MjcsInRleHQiOiIhW0NyYXds
aW5nIGV4YW1wbGUgZGlhZ3JhbV0oaHR0cHM6Ly9saDMuZ29vZ2
xldXNlcmNvbnRlbnQuY29tL3B3L0FDdEMtM2RJUk83dnFP4oCm
In19LCJjb21tZW50cyI6eyJnbzFIcEpJRFRtUm9qSXB3Ijp7Im
Rpc2N1c3Npb25JZCI6ImpNTUJYQmVPOFJmV3ZlVXYiLCJzdWIi
OiJnaDoxMjU4ODg5NCIsInRleHQiOiJncmFwaCBURDsgc2VsZi
0tPkE7IHNlbGYtLT5COyBzZWxmLS0+QzsgQS0tPkQ7IEEtLT5F
OyBCLS0+RjsgQi0tPkc7IEMtLT5IOyBDLS0+STsgQy0tPko7IE
QtLT5LOyBELS0+TDsgRC0tPk07IEUtLT5OOyBFLS0+TzsgRi0t
PlA7IEYtLT5ROyBGLS0+UjsgRy0tPlM7IEctLT5UOyBILS0+VT
sgSC0tPlY7IEktLT5XOyBJLS0+WDsgSi0tPlk7IEotLT5aOyIs
ImNyZWF0ZWQiOjE2MDExMjIwNDk0MDR9fSwiaGlzdG9yeSI6Wz
EwMzQ0OTIxNzgsNzQxNjIyNzgsLTE1MTg5MjIxNzcsLTE5MTY1
NDEyODksLTc2ODA4ODA2LC0xNTYxNTgwODU0XX0=
-->