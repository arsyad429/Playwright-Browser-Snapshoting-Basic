function classifyRisk(label = '') {
    const text = label.toLowerCase();

    if (
        text.includes('delete') ||
        text.includes('remove') ||
        text.includes('hapus')
    ) {
        return 'destructive_action';
    }

    if (
        text.includes('send') ||
        text.includes('message') ||
        text.includes('kirim')
    ) {
        return 'external_message';
    }

    if (
        text.includes('pay') ||
        text.includes('checkout') ||
        text.includes('purchase') ||
        text.includes('bayar')
    ) {
        return 'financial_action';
    }

    if (
        text.includes('download')
    ) {
        return 'data_export';
    }

    return 'low_risk';
}
module.exports = classifyRisk;