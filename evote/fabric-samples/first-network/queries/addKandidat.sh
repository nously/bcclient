composer participant add -c dyahayu@pemilu-network -d '{"$class": "org.pemilu.pemilihan.Kandidat","kandidatId": "6594","namaCalon": "Dyah Ayu", "namaWakilCalon": "Prabandari", "nikCalon": "12345", "nikWakilCalon": "67890","nomorUrut": 1, "namaPartai": "Partai Kucing"}'

composer identity issue -c dyahayu@pemilu-network -f kandidat1dyahayu.card -u kandidat1dyahayu -a "resource:org.pemilu.pemilihan.Kandidat#6594"

composer card import -f kandidat1dyahayu.card
composer network ping -c kandidat1dyahayu@pemilu-network
