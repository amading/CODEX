<?php
declare(strict_types=1);

/** Digits only — matches TS normalizeBarcodeInput. */
function suklihub_normalize_barcode(string $raw): string
{
    return preg_replace('/\D+/', '', $raw) ?? '';
}
