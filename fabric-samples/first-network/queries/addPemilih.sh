composer participant add -c dyahayu@pemilu-network -d '{"$class": "org.pemilu.pemilihan.Pemilih","nik": "9202", "nama": "Bukan Dyah Ayu","temdyahayu"tpsAsal": "resource:org.pemilu.pemilihan.TPS#1", "tpsMemilih": "resource:org.pemilu.pemilihan.TPS#1"}'

composer identity issue -c dyahayu@pemilu-network -f bukanDyahAyu.card -u bukanDyahAyu -a "resource:org.pemilu.pemilihan.Pemilih#9202"

composer card import -f bukanDyahAyu.card
composer network ping -c bukanDyahAyu@pemilu-network
