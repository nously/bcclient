/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Pemilih menggunakan hak suara
 * @param {org.pemilu.pemilihan.GunakanSuara} tx
 * @transaction
 */
async function GunakanSuara(tx) {
    tx.suara.sudahDigunakan = true;
    tx.suara.pemilih.sudahMemilih = true;
    tx.suara.pemilih = null;
    tx.suara.owner = tx.kandidat;

    // javascript promise
    return getAssetRegistry('org.pemilu.pemilihan.Suara')
        .then(function (suaraRegistry) {
            return suaraRegistry.update(tx.suara);
        })
        .catch(function (error) {
            console.error(error);
        });
}

/**
 * VotingOrganizer bisa menambah pemilih
 * @param {org.pemilu.pemilihan.TambahPemilih} tx
 * @transaction
 */
async function TambahPemilih(tx) {
    const factory = getFactory();
    let newParticipant = factory.newResource('org.pemilu.pemilihan', 'Pemilih', tx.nik);
    newParticipant.nama = tx.nama;
    newParticipant.tempatLahir = tx.tempatLahir;
    newParticipant.tanggalLahir = tx.tanggalLahir;
    newParticipant.sudahMemilih = tx.sudahMemilih;

    getParticipantRegistry('org.pemilu.pemilihan.Pemilih')
        .then(function (pemilihRegistry) {
            return pemilihRegistry.add(newParticipant);
        })
        .catch(function (error) {
            console.error(error);
        });
    
    let newSuara = factory.newResource('org.pemilu.pemilihan', 'Suara', "WillBeRandom-1234");
    newSuara.sudahDigunakan = false;
    newSuara.owner = null;
    newSuara.pemilih = newParticipant;

    getAssetRegistry('org.pemilu.pemilihan.Suara')
        .then(function (suaraRegistry) {
            return suaraRegistry.add(newSuara);
        })
        .catch(function (error) {
            console.error(error);
        });
}

/**
 * Business admin bisa menambah VotingOrganizer
 * @param {org.pemilu.pemilihan.TambahVotingOrganizer} tx
 * @transaction
 */
async function TambahVotingOrganizer(tx) {
    const factory = getFactory();
    let newParticipant = factory.newResource('org.pemilu.pemilihan', 'VotingOrganizer', tx.votingOrganizerId);
    newParticipant.nama = tx.nama;

    return getParticipantRegistry('org.pemilu.pemilihan.VotingOrganizer')
        .then(function (votingOrganizerRegistry) {
            return votingOrganizerRegistry.add(newParticipant);
        })
        .catch(function (error) {
            console.error(error);
        });
}

/**
 * VotingOrganizer bisa menambah kandidat
 * @param {org.pemilu.pemilihan.TambahKandidat} tx
 * @transaction
 */
async function TambahKandidat(tx) {
    const factory = getFactory();
    let newParticipant = factory.newResource('org.pemilu.pemilihan', 'Kandidat', tx.kandidatId);
    newParticipant.namaCalon = tx.namaCalon;
    newParticipant.namaWakilCalon = tx.namaWakilCalon;
    newParticipant.nikCalon = tx.nikCalon;
    newParticipant.nikWakilCalon = tx.nikWakilCalon;
    newParticipant.nomorUrut = tx.nomorUrut;
    newParticipant.jargon = tx.jargon;

    return getParticipantRegistry('org.pemilu.pemilihan.Kandidat')
        .then(function (kandidatRegistry) {
            return kandidatRegistry.add(newParticipant);
        })
        .catch(function (error) {
            console.error(error);
        });
}

/**
 * VotingOrganizer bisa membuat suara
 * @param {org.pemilu.pemilihan.BuatMonitoringWebServer} tx
 * @transaction
 */
async function BuatMonitoringWebServer(tx) {
    const factory = getFactory();
    let newParticipant = factory.newResource('org.pemilu.pemilihan', 'MonitoringWebServer', tx.monitoringWebServerId);
    newParticipant.alamat = tx.alamat;

    return getParticipantRegistry('org.pemilu.pemilihan.MonitoringWebServer')
        .then(function (monitoringWebServerRegistry) {
            return monitoringWebServerRegistry.add(newParticipant);
        })
        .catch(function (error) {
            console.error(error);
        });
}
