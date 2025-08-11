        // Step 3: Core Algorithm (Your Logic Improved)
        class NotesCalculator {
            constructor() {
                // Indian currency denominations (highest to lowest)
                this.denominations = [500, 200, 100, 50, 20, 10, 5, 2, 1];
                this.noteImages = {
                     500: '💵', 200: '💴', 100: '💶',
                    50: '💳', 20: '💰', 10: '🪙', 5: '🪙', 2: '🪙', 1: '🪙'
                };
            }

            calculate(amount) {
                // Input validation
                if (!amount || amount <= 0) {
                    throw new Error('Please enter a valid amount greater than 0');
                }

                if (amount > 999999999) {
                    throw new Error('Amount cannot exceed ₹99,99,99,999');
                }

                const result = [];
                let remainingAmount = parseInt(amount);
                let totalNotes = 0;

                this.denominations.forEach((denomination) => {
                    if (remainingAmount >= denomination) {
                        const count = Math.floor(remainingAmount / denomination);
                        remainingAmount = remainingAmount % denomination;
                        totalNotes += count;

                        result.push({
                            denomination: denomination,
                            count: count,
                            totalValue: denomination * count,
                            icon: this.noteImages[denomination] || '💰'
                        });
                    }
                });

                return {
                    breakdown: result,
                    totalNotes: totalNotes,
                    originalAmount: amount
                };
            }

            formatNumber(num) {
                return new Intl.NumberFormat('en-IN').format(num);
            }
        }

        // Step 4: DOM Management and User Interface
        class UIManager {
            constructor(calculator) {
                this.calculator = calculator;
                this.initializeElements();
                this.bindEvents();
            }

            initializeElements() {
                this.amountInput = document.getElementById('amountInput');
                this.calculateBtn = document.getElementById('calculateBtn');
                this.clearBtn = document.getElementById('clearBtn');
                this.resultsSection = document.getElementById('resultsSection');
                this.notesBreakdown = document.getElementById('notesBreakdown');
                this.totalAmount = document.getElementById('totalAmount');
                this.totalNotes = document.getElementById('totalNotes');
                this.errorMessage = document.getElementById('errorMessage');
                this.errorText = document.getElementById('errorText');
                this.quickAmountBtns = document.querySelectorAll('.quick-amount');
            }

            bindEvents() {
                // Calculate button click
                this.calculateBtn.addEventListener('click', () => this.handleCalculate());

                // Enter key press
                this.amountInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.handleCalculate();
                });

                // Real-time input validation
                this.amountInput.addEventListener('input', () => {
                    this.hideError();
                    const value = this.amountInput.value;
                    if (value && !isNaN(value) && value > 0) {
                        this.calculateBtn.disabled = false;
                        this.calculateBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                    }
                });

                // Clear button
                this.clearBtn.addEventListener('click', () => this.handleClear());

                // Quick amount buttons
                this.quickAmountBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const amount = btn.dataset.amount;
                        this.amountInput.value = amount;
                        this.handleCalculate();
                    });
                });
            }

            handleCalculate() {
                try {
                    const amount = this.amountInput.value.trim();
                    const result = this.calculator.calculate(amount);
                    this.displayResults(result);
                    this.hideError();
                } catch (error) {
                    this.showError(error.message);
                    this.hideResults();
                }
            }

            handleClear() {
                this.amountInput.value = '';
                this.hideResults();
                this.hideError();
                this.amountInput.focus();
            }

            displayResults(result) {
                // Update summary
                this.totalAmount.textContent = this.calculator.formatNumber(result.originalAmount);
                this.totalNotes.textContent = result.totalNotes;

                // Create notes breakdown HTML
                const notesHTML = result.breakdown.map(note => `
                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-3 hover:bg-gray-100 transition-colors">
                        <div class="flex items-center space-x-4">
                            <div class="text-2xl">${note.icon}</div>
                            <div>
                                <div class="font-semibold text-gray-800">₹${this.calculator.formatNumber(note.denomination)}</div>
                                <div class="text-sm text-gray-600">Indian Rupee Note</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-bold text-blue-600">${note.count}</div>
                            <div class="text-sm text-gray-600">notes</div>
                        </div>
                        <div class="text-right">
                            <div class="font-semibold text-gray-800">₹${this.calculator.formatNumber(note.totalValue)}</div>
                            <div class="text-sm text-gray-600">total value</div>
                        </div>
                    </div>
                `).join('');

                this.notesBreakdown.innerHTML = notesHTML;
                this.showResults();
            }

            showResults() {
                this.resultsSection.classList.remove('hidden');
                this.resultsSection.scrollIntoView({ behavior: 'smooth' });
            }

            hideResults() {
                this.resultsSection.classList.add('hidden');
            }

            showError(message) {
                this.errorText.textContent = message;
                this.errorMessage.classList.remove('hidden');
            }

            hideError() {
                this.errorMessage.classList.add('hidden');
            }
        }

        // Step 5: Initialize Application
        document.addEventListener('DOMContentLoaded', () => {
            const calculator = new NotesCalculator();
            const ui = new UIManager(calculator);

            // Focus on input field when page loads
            document.getElementById('amountInput').focus();

            // Add some nice loading animation
            document.body.classList.add('opacity-0');
            setTimeout(() => {
                document.body.classList.remove('opacity-0');
                document.body.classList.add('transition-opacity', 'duration-500');
            }, 100);

            console.log('🎉 Indian Notes Calculator initialized successfully!');
        });
    
