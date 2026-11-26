document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('transaction-form');
    const typeInput = document.getElementById('type');
    const descInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const list = document.getElementById('transaction-list');

    // Element untuk menampilkan total
    const totalIncomeEl = document.getElementById('total-income');
    const totalExpenseEl = document.getElementById('total-expense');
    const totalSavingsEl = document.getElementById('total-savings');
    const totalEmergencyEl = document.getElementById('total-emergency');

    // Ambil data dari localStorage atau inisialisasi array kosong
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    // Format ke Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    // Simpan ke localStorage
    const saveData = () => {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    };

    // Update Tampilan (UI)
    const updateUI = () => {
        // Kosongkan list
        list.innerHTML = '';

        let income = 0;
        let expense = 0;
        let savings = 0;
        let emergency = 0;

        if (transactions.length === 0) {
            list.innerHTML = '<li class="empty-state">Belum ada transaksi.</li>';
        } else {
            // Looping dari yang terbaru
            transactions.slice().reverse().forEach((tx, index) => {
                // Hitung total
                if (tx.type === 'income') income += tx.amount;
                else if (tx.type === 'expense') expense += tx.amount;
                else if (tx.type === 'savings') savings += tx.amount;
                else if (tx.type === 'emergency') emergency += tx.amount;

                // Buat elemen list
                const li = document.createElement('li');
                li.className = `transaction-item ${tx.type}`;
                
                // Tentukan prefix (+ / -)
                let prefix = '';
                let amountClass = '';
                if (tx.type === 'income') {
                    prefix = '+ ';
                    amountClass = 'positive';
                } else {
                    prefix = '- ';
                    amountClass = 'negative';
                }

                li.innerHTML = `
                    <div class="tx-info">
                        <span class="tx-desc">${tx.description}</span>
                        <span class="tx-type">${tx.type}</span>
                    </div>
                    <div class="tx-amount ${amountClass}">
                        ${prefix}${formatRupiah(tx.amount)}
                    </div>
                `;
                list.appendChild(li);
            });
        }

        // Update text total di card
        totalIncomeEl.textContent = formatRupiah(income);
        totalExpenseEl.textContent = formatRupiah(expense);
        totalSavingsEl.textContent = formatRupiah(savings);
        totalEmergencyEl.textContent = formatRupiah(emergency);
    };

    // Event Listener untuk Form Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const newTransaction = {
            id: Date.now(),
            type: typeInput.value,
            description: descInput.value,
            amount: parseFloat(amountInput.value)
        };

        transactions.push(newTransaction);
        saveData();
        updateUI();

        // Reset form
        form.reset();
    });

    // Jalankan UI saat pertama kali dimuat
    updateUI();
});