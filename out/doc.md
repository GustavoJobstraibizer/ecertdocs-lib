<div id="main">

# Global

<section>

<header></header>

<article>

### Methods

#### <span class="type-signature"></span>addPDFDocument<span class="signature">(pdfFile)</span> <span class="type-signature">→ {Promise}</span>

<div class="description">Adiciona o documento com a extensão .pdf onde serão feita as assinatuas.</div>

##### Parameters:

<table class="params">

<thead>

<tr>

<th>Name</th>

<th>Type</th>

<th class="last">Description</th>

</tr>

</thead>

<tbody>

<tr>

<td class="name">`pdfFile`</td>

<td class="type"><span class="param-type">File</span></td>

<td class="description last">Arquivo pdf onde serão feitas as assinaturas.</td>

</tr>

</tbody>

</table>

<dl class="details">

<dt class="tag-source">Source:</dt>

<dd class="tag-source">

- [index.js](index.js.html), [line 59](index.js.html#line59)

</dd>

</dl>

##### Returns:

<div class="param-desc">Promise boolean caso o arquivo for válido.</div>

<dl>

<dt>Type</dt>

<dd><span class="param-type">Promise</span></dd>

</dl>

#### <span class="type-signature"></span>createParticipantSignature<span class="signature">()</span><span class="type-signature"></span>

<div class="description">Adiciona um participante a assinatura do documento.</div>

##### Properties:

<table class="props">

<thead>

<tr>

<th>Name</th>

<th>Type</th>

<th class="last">Description</th>

</tr>

</thead>

<tbody>

<tr>

<td class="name">`email`</td>

<td class="type"><span class="param-type">string</span></td>

<td class="description last">Email do participante.</td>

</tr>

<tr>

<td class="name">`document`</td>

<td class="type"><span class="param-type">string</span></td>

<td class="description last">CPF do participante.</td>

</tr>

<tr>

<td class="name">`name`</td>

<td class="type"><span class="param-type">string</span></td>

<td class="description last">Nome do participante.</td>

</tr>

<tr>

<td class="name">`role`</td>

<td class="type"><span class="param-type">string</span></td>

<td class="description last">Perfil do participante na assinatura.</td>

</tr>

<tr>

<td class="name">`tipoAssinatura`</td>

<td class="type"><span class="param-type">number</span></td>

<td class="description last">Tipo da assinatura 'DIGITAL' ou 'ELETRÔNICA'.</td>

</tr>

</tbody>

</table>

<dl class="details">

<dt class="tag-source">Source:</dt>

<dd class="tag-source">

- [index.js](index.js.html), [line 77](index.js.html#line77)

</dd>

</dl>

#### <span class="type-signature"></span>getParticipants<span class="signature">()</span> <span class="type-signature">→ {Object}</span>

<div class="description">Lista com todos os participantes configurados para assinatura do documento.</div>

<dl class="details">

<dt class="tag-source">Source:</dt>

<dd class="tag-source">

- [index.js](index.js.html), [line 192](index.js.html#line192)

</dd>

</dl>

##### Returns:

<div class="param-desc">Lista de participantes configurados.</div>

<dl>

<dt>Type</dt>

<dd><span class="param-type">Object</span></dd>

</dl>

#### <span class="type-signature"></span>removeParticipantSignature<span class="signature">(document)</span><span class="type-signature"></span>

<div class="description">Remove o participante da assinatura do documento.</div>

##### Parameters:

<table class="params">

<thead>

<tr>

<th>Name</th>

<th>Type</th>

<th class="last">Description</th>

</tr>

</thead>

<tbody>

<tr>

<td class="name">`document`</td>

<td class="type"><span class="param-type">string</span></td>

<td class="description last">cpf do assinante.</td>

</tr>

</tbody>

</table>

<dl class="details">

<dt class="tag-source">Source:</dt>

<dd class="tag-source">

- [index.js](index.js.html), [line 135](index.js.html#line135)

</dd>

</dl>

#### <span class="type-signature"></span>resetData<span class="signature">()</span> <span class="type-signature">→ {Promise}</span>

<div class="description">Permite apagar os dados dos participantes configurados e o documento selecionado para a assinatura.</div>

<dl class="details">

<dt class="tag-source">Source:</dt>

<dd class="tag-source">

- [index.js](index.js.html), [line 181](index.js.html#line181)

</dd>

</dl>

##### Returns:

<div class="param-desc">Promise boolean.</div>

<dl>

<dt>Type</dt>

<dd><span class="param-type">Promise</span></dd>

</dl>

#### <span class="type-signature"></span>updateParticipantSignaturePos<span class="signature">(document)</span><span class="type-signature"></span>

<div class="description">Alteração da posição da assinatura do participante.</div>

##### Parameters:

<table class="params">

<thead>

<tr>

<th>Name</th>

<th>Type</th>

<th class="last">Description</th>

</tr>

</thead>

<tbody>

<tr>

<td class="name">`document`</td>

<td class="type"><span class="param-type">string</span></td>

<td class="description last">cpf do assinante.</td>

</tr>

</tbody>

</table>

<dl class="details">

<dt class="tag-source">Source:</dt>

<dd class="tag-source">

- [index.js](index.js.html), [line 119](index.js.html#line119)

</dd>

</dl>

</article>

</section>

</div>

<nav>

## [Home](index.html)

### Global

- [addPDFDocument](global.html#addPDFDocument)
- [createParticipantSignature](global.html#createParticipantSignature)
- [getParticipants](global.html#getParticipants)
- [removeParticipantSignature](global.html#removeParticipantSignature)
- [resetData](global.html#resetData)
- [updateParticipantSignaturePos](global.html#updateParticipantSignaturePos)

</nav>

<footer>Documentation generated by [JSDoc 3.6.5](https://github.com/jsdoc/jsdoc) on Tue Aug 25 2020 15:50:39 GMT-0300 (GMT-03:00)</footer>

<script>prettyPrint();</script>
