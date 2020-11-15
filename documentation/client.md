# Client

KyWeb is designed for use on Beaker's Hyperdrive protocol.

For each client, a new hyperdrive should be created and shared. This will serve as the data store, identification and frontend.

## Interface

The interface starts at the feed.
![Example interface](https://lh3.googleusercontent.com/pw/ACtC-3cyROD5kQIlZ312SwE1eUzXQqVSdRP0KrDoyh70HiUuvGUvUI6p4FkeV0jvWmIQM-tQGnxAFrhrePNgOpnNYaUM0G6x00CUGsMF6xPSu8Nh49EUZwDcnUUbPqMvXQKcaGauNJhr7VWyD3X53pwrZskRVg=w1272-h937-no?authuser=0)

### Following a user

From the main page, press `+`, this will come up with a dialog box with two fields.  
One says "`Search for a user`".
The other says "`Use code`".

Either will come up with a profile icon, profile name and a green "`follow`" button.  
Clicking the button will change it to a gray "`unfollow`" button and come up with a prompt to host the user's page.

### Profile

Clicking a user's name/profile icon will take you to their profile. This shows the user's name, description, profile icon and feed. Part of the profile shows a button which can also show you their interactions as well.
![Profile mockup](https://lh3.googleusercontent.com/pw/ACtC-3exLCJHpSbnjuWOhUA1Y1G2o2S7oMMdawn7aDk_Tj9q0lQaFi_MpAyFUqvlmfEdkRZMnRPueT30phQNk3RFV9Wqc2CryZwos2fRU4aUB0Je_oYLTEa0PH2ZBVA2vU7VDstLt-PvYHHj-PYGWri-aCoCew=w1310-h937-no?authuser=0)

## Functioning

The feed is a list of posts from addresses that the client has listed in [`follows`](follows.md). These posts are gathered from the [address](adress.md)es' [`feed`](feed.md) files.  
Posts are then filtered based on the address' filters (see [filters](filters.md) for more).  
After filtering, interactions are added, these are gathered from the client's [`interactions`](interactions.md), [`follows`](follows.md)' addresses' [`interactions`](interactions.md), their [`follows`](follows.md)' addresses' [`interactions`](interactions.md) and so on.  
The level of following to do is ideally set by a settings option and defaults to 3 (self, following, following, following).

![Crawling example diagram](https://lh3.googleusercontent.com/pw/ACtC-3dIRO7vqORVtKok-LkgbemfzOLcYzOsLAp7x-7MfkyLan-vTMZ7b-2vFjOfnoEnMk1xDZ7EbVw6sW-VVCgPy9qaUkAaqx0fRe4tSJYmEQYx1sbkbsT-M20quRBw9hO-e2CQu_7u44UnJudXr9qXB91Diw=w1480-h436-no?authuser=0)
`self` would load [interactions](interactions.md) from `A`-`Z` but [feeds](feeds.md) only from `A`-`C`.

### Following a user

Searching for a user will [query the tree](concepts.md#querying-the-tree) for a user with the search term as their name.  
Entering a "code" (an address) will scan the address and check for a self file. If found it will display this to the user.

Clicking follow will add the address to the [`follows`](follows.md) file and prompt user to host the address.

<!--stackedit_data:
eyJkaXNjdXNzaW9ucyI6eyJqTU1CWEJlTzhSZld2ZVV2Ijp7In
N0YXJ0IjoyMDI2LCJlbmQiOjIyNzUsInRleHQiOiIhW0NyYXds
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
ExODc3OTYzNTYsMTMzOTY5NDM5NywxMDM0NDkyMTc4LDc0MTYy
Mjc4LC0xNTE4OTIyMTc3LC0xOTE2NTQxMjg5LC03NjgwODgwNi
wtMTU2MTU4MDg1NF19
-->
