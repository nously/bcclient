composer participant add -c bob@pemilu-network -d '{"$class": "org.pemilu.pemilihan.MonitoringWebServer", "monitoringWebServerId": "2420","alamat": "http://lalala"}'

composer identity issue -c bob@pemilu-network -f monitoring1.card -u monitoring1 -a "resource:org.pemilu.pemilihan.MonitoringWebServer#2420"

composer card import -f monitoring1.card
composer network ping -c monitoring1@pemilu-network
