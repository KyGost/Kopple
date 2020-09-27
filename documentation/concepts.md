# Concepts
## Querying the tree
**Alias**: Crawl

Querying the tree is how the client gets data from other clients.

Each client has an address. This address is where their data is stored. One of the pieces of data stored is the [`follows`](follows.md) file; this file lists other users.

We can keep querying any addresses we find in this "crawl", until we are happy. The distance we go is mesured in steps from self to end. One step is one address.  
If a thread were to start at self, go to a following addess, go to that one of that address' following addresses, then go to one of that address' following addresses it would be three steps.

### Example
After filtering, interactions are added, these are gathered from the client's [`interactions`](interactions.md), [`follows`](follows.md)' addresses' [`interactions`](interactions.md), their [`follows`](follows.md)' addresses' [`interactions`](interactions.md) and so on.  
The level of following to do is ideally set by a settings option and defaults to 3 (self, following, following, following).  

![Crawling example diagram](https://lh3.googleusercontent.com/pw/ACtC-3dIRO7vqORVtKok-LkgbemfzOLcYzOsLAp7x-7MfkyLan-vTMZ7b-2vFjOfnoEnMk1xDZ7EbVw6sW-VVCgPy9qaUkAaqx0fRe4tSJYmEQYx1sbkbsT-M20quRBw9hO-e2CQu_7u44UnJudXr9qXB91Diw=w1480-h436-no?authuser=0)
`self` would load [interactions](interactions.md) from `A`-`Z` but [feeds](feeds.md) only from `A`-`C`.

## Address
Means: Hosted location of any user in the web.  
On the basis of [beaker](https://beaker.dev/), hyper:// hosting location of a client.
<!--stackedit_data:
eyJoaXN0b3J5IjpbNDcyMTUyODcwLDk1MzkzNTUxOV19
-->