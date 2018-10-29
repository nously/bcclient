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
    tx.suara.pemilih = null;
    tx.suara.owner = tx.kandidat;

    return getAssetRegistry('org.pemilu.pemilihan.Suara')
        .then(function (suaraRegistry) {
            return suaraRegistry.update(tx.suara);
        })
        .catch(function (error) {
            // Add optional error handling here.
        });

    // Emit an event for the modified asset.
    // let event = getFactory().newEvent('org.pemilu.pemilihan', 'SuaraDigunakan');
    // event.pemilih = tx.pemilih;
    // emit(event);
}

/**
 * Business admin bisa menghapus semua suara
 * @param {org.pemilu.pemilihan.HapusSuara} tx
 * @transaction
 */
async function HapusSuara(tx) {

}

/**
 * Business admin bisa menghapus semua suara
 * @param {org.pemilu.pemilihan.TambahPemilih} tx
 * @transaction
 */
async function TambahPemilih(tx) {

}

/**
 * Business admin bisa menghapus semua suara
 * @param {org.pemilu.pemilihan.TambahKandidat} tx
 * @transaction
 */
async function TambahKandidat(tx) {

}

/**
 * Business admin bisa menghapus semua suara
 * @param {org.pemilu.pemilihan.HapusKandidat} tx
 * @transaction
 */
async function HapusKandidat(tx) {

}
