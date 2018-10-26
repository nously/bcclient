composer participant add -c bob@pemilu-network -d '{"$class": "org.pemilu.pemilihan.KPUMember", "KPUMemberId": "5660","nama": "Dyah Ayu"}'

composer identity issue -c bob@pemilu-network -f dyahayu.card -u dyahayu -a "resource:org.pemilu.pemilihan.KPUMember#5660"

composer card import -f dyahayu.card
composer network ping -c dyahayu@pemilu-network
