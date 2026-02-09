// UI generation functions for Quill AI Writing Assistant

export function generateMainPageHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quill - AI Writing Assistant</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
            color: #e0e0e0;
            min-height: 100vh;
            padding: 20px;
            padding-bottom: 50px; /* Space for footer */
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            position: relative;
        }

        .header h1 {
            font-size: 3rem;
            font-weight: 300;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #00d4ff, #00ff88);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .header p {
            font-size: 1.1rem;
            opacity: 0.8;
        }

        /* Mobile responsiveness improvements */
        @media (max-width: 768px) {
            body {
                padding: 15px;
            }

            .header {
                margin-bottom: 30px;
            }

            .header h1 {
                font-size: 2.2rem;
            }

            .header p {
                font-size: 1rem;
            }
        }

        @media (max-width: 480px) {
            body {
                padding: 10px;
            }

            .header h1 {
                font-size: 1.8rem;
            }

            .header p {
                font-size: 0.9rem;
            }
        }

        .settings-link {
            position: absolute;
            top: 0;
            right: 0;
            color: #00d4ff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 8px;
            transition: all 0.3s ease;
            font-size: 14px;
        }

        .settings-link:hover {
            background: rgba(0, 212, 255, 0.1);
        }

        .form-container {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 30px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        /* Responsive form improvements */
        @media (max-width: 768px) {
            .form-container {
                padding: 20px;
                border-radius: 15px;
            }

            .form-grid {
                grid-template-columns: 1fr;
                gap: 15px;
            }
        }

        @media (max-width: 480px) {
            .form-container {
                padding: 15px;
                margin-bottom: 20px;
            }

            .form-grid {
                gap: 12px;
            }
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group.full-width {
            grid-column: 1 / -1;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #00d4ff;
        }

        input, select, textarea {
            width: 100%;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: #e0e0e0;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #00d4ff;
            box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
        }

        textarea {
            resize: vertical;
            min-height: 100px;
        }

        .tag-input-container {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
        }

        .tag-input {
            flex: 1;
        }

        .add-tag-btn {
            padding: 12px 16px;
            background: rgba(0, 212, 255, 0.2);
            border: 1px solid #00d4ff;
            border-radius: 8px;
            color: #00d4ff;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .add-tag-btn:hover {
            background: rgba(0, 212, 255, 0.3);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 212, 255, 0.25);
        }

        .add-tag-btn:active {
            transform: translateY(0);
        }

        .tags-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
        }

        .tag {
            background: rgba(0, 212, 255, 0.2);
            border: 1px solid #00d4ff;
            border-radius: 20px;
            padding: 6px 12px;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .tag-remove {
            cursor: pointer;
            color: #ff6b6b;
            font-weight: bold;
        }

        .generate-btn {
            background: linear-gradient(45deg, #00d4ff, #00ff88);
            color: #0f0f0f;
            border: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            width: 100%;
            margin-top: 20px;
            position: relative;
            overflow: hidden;
        }

        .generate-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #00ff88, #00d4ff);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .generate-btn:hover::before {
            opacity: 1;
        }

        .generate-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 30px rgba(0, 212, 255, 0.4);
        }

        .generate-btn:active {
            transform: translateY(-1px);
            box-shadow: 0 6px 15px rgba(0, 212, 255, 0.3);
        }

        .generate-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .generate-btn:disabled:hover::before {
            opacity: 0;
        }

        .button-group {
            display: flex;
            gap: 15px;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
        }

        .reset-btn {
            background: linear-gradient(45deg, #ff6b6b, #ff4757);
            color: #ffffff;
            border: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            white-space: nowrap;
            position: relative;
            overflow: hidden;
        }

        .reset-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #ff4757, #ff6b6b);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .reset-btn:hover::before {
            opacity: 1;
        }

        .reset-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 30px rgba(255, 107, 107, 0.4);
        }

        .reset-btn:active {
            transform: translateY(-1px);
            box-shadow: 0 6px 15px rgba(255, 107, 107, 0.3);
        }

        .reset-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .reset-btn:disabled:hover::before {
            opacity: 0;
        }

        .reset-btn.hidden {
            display: none;
        }

        /* Mobile button improvements */
        @media (max-width: 480px) {
            .button-group {
                flex-direction: column;
                gap: 12px;
                width: 100%;
            }

            .generate-btn, .reset-btn {
                padding: 14px 32px;
                font-size: 15px;
                width: 100%;
            }
        }

        .loading {
            display: none;
            text-align: center;
            margin: 20px 0;
        }

        .progress-bar {
            width: 100%;
            height: 8px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            overflow: hidden;
            position: relative;
            margin-bottom: 15px;
        }

        .progress-bar::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 40%;
            background-color: #22C55E;
            border-radius: 4px;
            animation: progress-slide 2s linear infinite;
        }

        @keyframes progress-slide {
            0% { left: -40%; }
            100% { left: 100%; }
        }

        .result-container {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            padding: 30px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            display: none;
        }

        /* Mobile result container improvements */
        @media (max-width: 768px) {
            .result-container {
                padding: 20px;
                border-radius: 15px;
            }
        }

        @media (max-width: 480px) {
            .result-container {
                padding: 15px;
            }
        }

        .result-section {
            margin-bottom: 30px;
        }

        .result-section h3 {
            color: #00ff88;
            margin-bottom: 15px;
            font-size: 1.3rem;
        }

        .export-section {
            background: rgba(255, 255, 255, 0.08);
            border-radius: 15px;
            padding: 20px;
            margin-top: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .export-controls {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
        }

        /* Mobile export controls improvements */
        @media (max-width: 768px) {
            .export-controls {
                grid-template-columns: 1fr;
                gap: 12px;
            }
        }

        .export-select {
            width: 100%;
            padding: 10px 12px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: #e0e0e0;
            font-size: 14px;
        }

        .export-select:focus {
            outline: none;
            border-color: #00d4ff;
        }

        .export-buttons {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }

        .export-btn {
            background: linear-gradient(45deg, #00d4ff, #00ff88);
            color: #0f0f0f;
            border: none;
            padding: 10px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .export-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
        }

        .export-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .title-options, .subtitle-options {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }

        /* Mobile title/subtitle options improvements */
        @media (max-width: 768px) {
            .title-options, .subtitle-options {
                grid-template-columns: 1fr;
                gap: 12px;
            }
        }

        .option-card {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            padding: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .option-card:hover {
            border-color: #00d4ff;
            transform: translateY(-2px);
        }

        .option-card.selected {
            border-color: #00ff88;
            background: rgba(0, 255, 136, 0.1);
        }

        .option-title {
            font-weight: 600;
            margin-bottom: 5px;
        }

        .content-display {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 12px;
            padding: 20px;
            white-space: pre-wrap;
            line-height: 1.6;
            font-family: 'Georgia', serif;
        }

        .chapter-outline {
            display: grid;
            gap: 15px;
        }

        .chapter-item {
            background: rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 18px;
            border-left: 4px solid #00d4ff;
            margin-bottom: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }

        .chapter-item:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateX(2px);
        }

        .chapter-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            padding: 5px 0;
            margin-bottom: 10px;
        }

        .chapter-title-section {
            flex: 1;
        }

        .chapter-number {
            color: #00d4ff;
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 16px;
        }

        .chapter-toggle {
            color: #00d4ff;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.3s ease;
            margin-left: 12px;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: rgba(0, 212, 255, 0.1);
            cursor: pointer;
            border: 1px solid rgba(0, 212, 255, 0.3);
        }

        .chapter-toggle:hover {
            background: rgba(0, 212, 255, 0.2);
            transform: scale(1.1);
        }

        .chapter-toggle.collapsed {
            transform: rotate(0deg);
        }

        .chapter-toggle.expanded {
            transform: rotate(90deg);
        }

        .chapter-content-section {
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transform: scaleY(0);
            transform-origin: top;
            transition: all 0.4s ease;
        }

        .chapter-content-section.expanded {
            max-height: none;
            opacity: 1;
            transform: scaleY(1);
        }

        .chapter-details {
            margin-bottom: 15px;
        }

        /* Mobile chapter improvements */
        @media (max-width: 768px) {
            .chapter-item {
                padding: 12px;
            }

            .chapter-header {
                padding: 3px 0;
            }

            .chapter-toggle {
                font-size: 16px;
                width: 20px;
                height: 20px;
            }
        }

        @media (max-width: 480px) {
            .chapter-outline {
                gap: 12px;
            }

            .chapter-item {
                padding: 10px;
            }

            .chapter-header {
                padding: 2px 0;
                margin-bottom: 8px;
            }

            .chapter-toggle {
                font-size: 14px;
                width: 18px;
                height: 18px;
                margin-left: 5px;
            }
        }

        .chapter-actions {
            display: flex;
            gap: 10px;
            margin-top: 10px;
            flex-wrap: wrap;
        }

        .generate-chapter-btn {
            background: linear-gradient(45deg, #00ff88, #00d4ff);
            color: #0f0f0f;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .generate-chapter-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
        }

        .generate-chapter-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .export-chapter-buttons {
            display: flex;
            gap: 5px;
            margin-left: 5px;
        }

        .export-chapter-btn {
            background: linear-gradient(45deg, #ff6b6b, #ffa500);
            color: #ffffff;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .export-chapter-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }

        .chapter-loading {
            margin-top: 15px;
            color: #00ff88;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px;
            background: rgba(0, 255, 136, 0.1);
            border-radius: 8px;
            border: 1px solid rgba(0, 255, 136, 0.3);
        }

        .chapter-progress-bar {
            width: 100%;
            height: 6px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            overflow: hidden;
            position: relative;
            margin-bottom: 8px;
        }

        .chapter-progress-bar::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 40%;
            background-color: #22C55E;
            border-radius: 3px;
            animation: progress-slide 2s linear infinite;
        }

        .chapter-content {
            margin-top: 15px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            border-left: 4px solid #00ff88;
            line-height: 1.7;
            font-size: 14px;
            color: #e0e0e0;
            font-family: 'Georgia', serif;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }

        .error-message {
            background: rgba(255, 0, 0, 0.1);
            border: 1px solid rgba(255, 0, 0, 0.3);
            border-radius: 12px;
            padding: 15px;
            color: #ff6b6b;
            display: none;
        }

        .hidden {
            display: none !important;
        }

        .chapter-count-group {
            display: none;
        }

        .chapter-count-group.show {
            display: block;
        }

        /* Modal/Popup Styles */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .modal-overlay.show {
            opacity: 1;
            visibility: visible;
        }

        .modal-content {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 240, 240, 0.95) 100%);
            border-radius: 20px;
            padding: 30px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transform: scale(0.9) translateY(20px);
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .modal-overlay.show .modal-content {
            transform: scale(1) translateY(0);
        }

        .modal-title {
            color: #1a1a1a;
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 15px;
            background: linear-gradient(45deg, #00d4ff, #00ff88);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .modal-message {
            color: #555;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
            font-weight: 400;
        }

        .modal-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .modal-btn {
            padding: 14px 28px;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 120px;
            position: relative;
            overflow: hidden;
        }

        .modal-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .modal-btn:hover::before {
            left: 100%;
        }

        .modal-btn-cancel {
            background: linear-gradient(45deg, #f8f9fa, #e9ecef);
            color: #6c757d;
            border: 2px solid #dee2e6;
        }

        .modal-btn-cancel:hover {
            background: linear-gradient(45deg, #e9ecef, #dee2e6);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(108, 117, 125, 0.2);
        }

        .modal-btn-confirm {
            background: linear-gradient(45deg, #ff4757, #ff3838);
            color: white;
            border: 2px solid rgba(255, 71, 87, 0.3);
        }

        .modal-btn-confirm:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(255, 71, 87, 0.4);
            background: linear-gradient(45deg, #ff3838, #ff2828);
        }

        /* Mobile responsiveness for modal */
        @media (max-width: 480px) {
            .modal-content {
                padding: 25px 20px;
                margin: 20px;
                max-width: none;
                width: calc(100vw - 40px);
            }

            .modal-title {
                font-size: 20px;
            }

            .modal-message {
                font-size: 15px;
                margin-bottom: 25px;
            }

            .modal-buttons {
                gap: 12px;
            }

            .modal-btn {
                padding: 12px 24px;
                font-size: 15px;
                min-width: 110px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <a href="/settings" class="settings-link">Settings</a>
            <h1><a href="https://azzar.netlify.app" target="_blank" style="color: inherit; text-decoration: none;">Quill™</a></h1>
            <p>AI-powered writing assistant for articles and novels</p>
        </div>

        <form class="form-container" id="articleForm">
            <div class="form-grid">
                <div class="form-group">
                    <label for="topic">Topic *</label>
                    <input type="text" id="topic" name="topic" required placeholder="">
                </div>

                <div class="form-group">
                    <label for="authorStyle">Author Style to Copy *</label>
                    <select id="authorStyle" name="authorStyle" required>
                        <option value="">Select an author</option>
                        <option value="J.K. Rowling">J.K. Rowling</option>
                        <option value="George R.R. Martin">George R.R. Martin</option>
                        <option value="Jane Austen">Jane Austen</option>
                        <option value="Ernest Hemingway">Ernest Hemingway</option>
                        <option value="Toni Morrison">Toni Morrison</option>
                        <option value="Haruki Murakami">Haruki Murakami</option>
                        <option value="Margaret Atwood">Margaret Atwood</option>
                        <option value="Neil Gaiman">Neil Gaiman</option>
                        <option value="Chimamanda Ngozi Adichie">Chimamanda Ngozi Adichie</option>
                        <option value="Cormac McCarthy">Cormac McCarthy</option>
                        <option value="Dee Lestari">Dee Lestari</option>
                        <option value="Najwa Shihab">Najwa Shihab</option>
                        <option value="Pramoedya Ananta Toer">Pramoedya Ananta Toer</option>
                        <option value="Goenawan Mohamad">Goenawan Mohamad</option>
                        <option value="Leila S. Chudori">Leila S. Chudori</option>
                        <option value="Stephen King">Stephen King</option>
                        <option value="Agatha Christie">Agatha Christie</option>
                        <option value="Gabriel García Márquez">Gabriel García Márquez</option>
                        <option value="Zadie Smith">Zadie Smith</option>
                        <option value="Yuval Noah Harari">Yuval Noah Harari</option>
                        <option value="custom">Custom (enter below)</option>
                    </select>
                    <input type="text" id="customAuthorStyle" name="customAuthorStyle" placeholder="" style="margin-top: 10px; display: none;">
                </div>

                <div class="form-group">
                    <label for="type">Type *</label>
                    <select id="type" name="type" required>
                        <option value="">Select type</option>
                        <option value="article">Article</option>
                        <option value="shortstory">Short Story</option>
                        <option value="novel">Novel Outline</option>
                        <option value="news">News Article</option>
                    </select>
                </div>

                <div class="form-group newspaper-style-group" id="newspaperStyleGroup" style="display: none;">
                    <label for="newspaperStyle">Newspaper Style *</label>
                    <select id="newspaperStyle" name="newspaperStyle">
                        <option value="">Select newspaper style</option>
                        <option value="The New York Times">The New York Times</option>
                        <option value="The Washington Post">The Washington Post</option>
                        <option value="BBC News">BBC News</option>
                        <option value="CNN">CNN</option>
                        <option value="Reuters">Reuters</option>
                        <option value="Associated Press">Associated Press</option>
                        <option value="The Guardian">The Guardian</option>
                        <option value="The Wall Street Journal">The Wall Street Journal</option>
                        <option value="Fox News">Fox News</option>
                        <option value="Al Jazeera">Al Jazeera</option>
                        <option value="custom">Custom (enter below)</option>
                    </select>
                    <input type="text" id="customNewspaperStyle" name="customNewspaperStyle" placeholder="" style="margin-top: 10px; display: none;">
                </div>

                <div class="form-group">
                    <label for="language">Language *</label>
                    <select id="language" name="language" required>
                        <option value="">Select language</option>
                        <option value="english">English</option>
                        <option value="indonesian">Indonesian (Bahasa Indonesia)</option>
                    </select>
                </div>

                <div class="form-group chapter-count-group" id="chapterCountGroup">
                    <label for="chapterCount">Number of Chapters *</label>
                    <input type="number" id="chapterCount" name="chapterCount" min="1" max="50" placeholder="">
                </div>

                <div class="form-group">
                    <label for="tags">Tags</label>
                    <div class="tag-input-container">
                        <input type="text" id="tagInput" placeholder="">
                        <button type="button" class="add-tag-btn" id="addTagBtn">Add</button>
                    </div>
                    <div class="tags-container" id="tagsContainer"></div>
                </div>

                <div class="form-group">
                    <label for="keywords">Keywords</label>
                    <div class="tag-input-container">
                        <input type="text" id="keywordInput" placeholder="">
                        <button type="button" class="add-tag-btn" id="addKeywordBtn">Add</button>
                    </div>
                    <div class="tags-container" id="keywordsContainer"></div>
                </div>

                <div class="form-group">
                    <label for="mainIdea">Main Idea/Plot</label>
                    <textarea id="mainIdea" name="mainIdea" rows="4" placeholder=""></textarea>
                </div>
            </div>

            <div class="button-group">
            <button type="submit" class="generate-btn" id="generateBtn">
                Generate Content
            </button>
                <button type="button" class="reset-btn hidden" id="resetBtn">
                    Reset All
                </button>
            </div>
        </form>

        <div class="loading" id="loading">
            <div class="progress-bar"></div>
            <p>Generating your content with AI...</p>
        </div>

        <div class="error-message" id="errorMessage"></div>

        <div class="result-container" id="resultContainer">
            <!-- Results will be dynamically inserted here -->
        </div>

        <!-- Modal for confirmations -->
        <div class="modal-overlay" id="confirmationModal">
            <div class="modal-content">
                <h3 class="modal-title" id="modalTitle">Reset All Data</h3>
                <p class="modal-message" id="modalMessage">Are you sure you want to reset all data?</p>
                <div class="modal-buttons">
                    <button class="modal-btn modal-btn-cancel" id="modalCancel"></button>
                    <button class="modal-btn modal-btn-confirm" id="modalConfirm"></button>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Language strings
        const uiLanguages = {
            english: {
                title: 'Quill™',
                subtitle: 'AI-powered writing assistant for articles and novels',
                settings: 'Settings',
                settingsDescription: 'Configure your Quill writing assistant',
                topicLabel: 'Topic *',
                topicPlaceholder: 'e.g. romance, horror, philosophy',
                tagsLabel: 'Tags',
                tagsPlaceholder: 'Add a tag and press Enter',
                keywordsLabel: 'Keywords',
                keywordsPlaceholder: 'Add a keyword and press Enter',
                authorStyleLabel: 'Author Style *',
                selectAuthor: 'Select an author',
                customAuthorPlaceholder: 'Enter custom author name',
                newspaperStyleLabel: 'Newspaper Style *',
                selectNewspaper: 'Select newspaper style',
                customNewspaperPlaceholder: 'Enter custom newspaper style',
                selectLanguage: 'Select language',
                addButton: 'Add',
                chapterCountPlaceholder: 'e.g. 10',
                typeLabel: 'Type *',
                typeArticle: 'Article',
                typeShortStory: 'Short Story',
                typeNews: 'News Article',
                typeNovel: 'Novel Outline',
                chapterCountLabel: 'Number of Chapters',
                languageLabel: 'Content Language *',
                mainIdeaLabel: 'Main Idea/Plot',
                mainIdeaPlaceholder: 'Describe your main idea, plot, or concept that you want the AI to build upon. This will help generate content that aligns with your specific vision.',
                generateButton: 'Generate Content',
                resetButton: 'Reset All',
                resetConfirmTitle: 'Reset All Data',
                resetConfirmMessage: 'Are you sure you want to reset all data? This will clear your form and generated content.',
                cancelButton: 'Cancel',
                resetModalButton: 'Reset',
                generating: 'Generating your content with AI...',
                loadingFacts: [
                    'Did you know? The quill pen was invented in the 6th century...',
                    'Crafting your story with AI precision...',
                    'The first quills came from swan feathers...',
                    'AI is weaving your narrative masterpiece...',
                    'Ancient scribes used reed pens before quills...',
                    'Memorizing your words with intelligent algorithms...',
                    'Quill pens can write up to 10,000 words per day...',
                    'Transforming ideas into beautiful prose...',
                    'The quill revolutionized writing in medieval Europe...',
                    'Shakespeare wrote 37 plays and 154 sonnets...',
                    'The typewriter was invented in 1868...',
                    'AI is learning from millions of literary masterpieces...',
                    'The longest novel ever written is 9,609,000 words...',
                    'Famous authors like Hemingway wrote standing up...',
                    'The first computer novel was written in 1952...',
                    'AI can analyze writing styles of any author...',
                    'The quill pen was used for over 1,000 years...',
                    'Jane Austen wrote her novels in the 19th century...',
                    'Digital writing tools have evolved rapidly...',
                    'The art of storytelling dates back to ancient caves...',
                    'AI helps writers overcome creative blocks...',
                    'The first fountain pen was invented in 1884...',
                    'Literature has shaped human culture for millennia...',
                    'Modern AI continues the tradition of great storytellers...',
                    'Writing by hand improves memory and creativity...',
                    'The ballpoint pen was invented in 1938...',
                    'AI analyzes themes, plots, and character development...',
                    'The printing press revolutionized knowledge sharing...',
                    'Every great writer started as a beginner...',
                    'AI preserves writing traditions while innovating...',
                    'The first writing system was cuneiform, invented by Sumerians around 3500 BCE...',
                    'Shakespeare created 1,700+ new words still used in modern English...',
                    'The novel form emerged in 18th century England with works like Robinson Crusoe...',
                    'Hieroglyphs were used for over 3,000 years in ancient Egypt...',
                    'The first dictionary was compiled by Robert Cawdrey in 1604...',
                    'Sanskrit is the oldest language still continuously used...',
                    'The Rosetta Stone helped decipher Egyptian hieroglyphs in 1799...',
                    'All languages share universal grammar patterns according to linguistic research...',
                    'The first programming language was created in 1883 by Ada Lovelace...',
                    'AI language models can now translate between over 100 languages...',
                    'The Oxford English Dictionary contains 600,000+ words and phrases...',
                    'Edgar Allan Poe invented the modern detective story genre...',
                    'Frankenstein (1818) karya Mary Shelley dianggap sebagai novel fiksi ilmiah pertama...',
                    'The quill pen was used for over 1,000 years, from ancient times to the 19th century...',
                    'Monastic scribes preserved ancient texts through the European Dark Ages...',
                    'The first newspaper was published in Strasbourg in 1605...',
                    'Dante Alighieri chose to write The Divine Comedy in Italian instead of Latin...',
                    'The first typewriter patent was granted to Henry Mill in 1714...',
                    'AI can now detect writing styles with over 95% accuracy...',
                    'The oldest surviving printed book is the Diamond Sutra from 868 CE...',
                    'Writing systems evolved independently in at least 4 ancient civilizations...',
                    'The first e-book was created by Michael Hart in 1971...',
                    'AI language models are trained on billions of text samples from human writing...',
                    'Writing systems developed independently in China, Mesopotamia, Egypt, and Mesoamerica...',
                    'The invention of paper by the Chinese revolutionized global communication...',
                    'Calligraphy became a highly respected art form in many Asian cultures...',
                    'The first printing press was invented by Johannes Gutenberg in 1450...',
                    'Literature has been used as propaganda since ancient Roman times...',
                    'The shortest story ever written is just six words long...',
                    'Writing on clay tablets began over 5,000 years ago...',
                    'The first modern novel is considered to be Don Quixote by Cervantes...',
                    'Writing helped preserve oral traditions and cultural histories...',
                    'The first encyclopedia was published in China during the Ming Dynasty...',
                    'Typography evolved from handwritten scripts to digital fonts...',
                    'Writing systems use between 20 to 100 symbols for complete communication...',
                    'The first copyright law was established in Britain in 1710...',
                    'Literature reflects the social and political climate of its era...',
                    'Writing tools evolved from stone styluses to computer keyboards...',
                    'The first newspaper was published in Germany in 1609...',
                    'Fairy tales were originally oral stories before being written down...',
                    'Writing enables time travel through preserved human thoughts...',
                    'The first public library was established in ancient Nineveh...',
                    'Emily Dickinson wrote over 1,800 poems, mostly discovered after her death...',
                    'The word "novel" comes from Italian "novella" meaning "new story"...',
                    'Mark Twain was the first author to submit a typewritten manuscript...',
                    'The Great Wall of China was built using written construction plans...',
                    'Virginia Woolf revolutionized stream-of-consciousness writing...'
                ],
                apiKeyRequired: 'Please set your Gemini API key in Settings first.',
                missingFields: 'Missing required fields',
                tagsRequired: 'Please add at least one tag',
                exportMarkdown: 'Export as Markdown',
                exportRTF: 'Export as RTF',
                generateChapter: 'Generate Chapter Content',
                generatingChapter: 'Generating...',
                regenerateChapter: 'Regenerate Chapter',
                exportChapter: 'Export Chapter',
                selectTitle: 'Select Title',
                selectSubtitle: 'Select Subtitle',
                novelTitle: 'Novel Title',
                synopsis: 'Synopsis',
                outline: 'Outline',
                chapter: 'Chapter',
                refinedTags: 'Refined Tags',
                content: 'Content',
                backToGenerator: '← Back to Generator',
                languageSettings: 'Language Settings',
                interfaceLanguage: 'Interface Language',
                languageHelp: 'Choose the language for the user interface',
                apiConfiguration: 'Gemini AI Configuration',
                getApiKey: 'How to get your API key:',
                apiSteps: ['Go to Google AI Studio', 'Sign in with your Google account', 'Create a new API key', 'Copy the key and paste it below'],
                apiKeyLabel: 'Gemini API Key *',
                apiKeyPlaceholder: 'Enter your Gemini API key',
                saveApiKey: 'Save API Key',
                removeApiKey: 'Remove API Key',
                apiKeySaved: 'API key saved successfully!',
                apiKeyVerified: 'API key verified and saved successfully!',
                apiKeyVerificationFailed: 'API key saved but verification failed: ',
                apiKeySaveError: 'API key saved but could not verify: ',
                apiKeyQuotaExceeded: 'API quota exceeded. Please check your Gemini API billing/limits.',
                apiKeyInvalid: 'Invalid API key. Please check that your Gemini API key is correct and enabled.',
                networkError: 'Network error. Please check your internet connection and try again.',
                pleaseEnterApiKey: 'Please enter an API key'
            },
            indonesian: {
                title: 'Quill™',
                subtitle: 'Asisten penulisan bertenaga AI untuk artikel dan novel',
                settings: 'Pengaturan',
                settingsDescription: 'Konfigurasikan asisten penulisan Quill Anda',
                topicLabel: 'Topik *',
                topicPlaceholder: 'contoh: romansa, horor, filsafat',
                tagsLabel: 'Tag',
                tagsPlaceholder: 'Tambahkan tag dan tekan Enter',
                keywordsLabel: 'Kata Kunci',
                keywordsPlaceholder: 'Tambahkan kata kunci dan tekan Enter',
                authorStyleLabel: 'Gaya Penulis *',
                selectAuthor: 'Pilih penulis',
                customAuthorPlaceholder: 'Masukkan nama penulis kustom',
                newspaperStyleLabel: 'Gaya Koran *',
                selectNewspaper: 'Pilih gaya koran',
                customNewspaperPlaceholder: 'Masukkan gaya koran kustom',
                selectLanguage: 'Pilih bahasa',
                addButton: 'Tambah',
                chapterCountPlaceholder: 'contoh: 10',
                typeLabel: 'Tipe *',
                typeArticle: 'Artikel',
                typeShortStory: 'Cerita Pendek',
                typeNews: 'Artikel Berita',
                typeNovel: 'Rangkuman Novel',
                chapterCountLabel: 'Jumlah Bab',
                languageLabel: 'Bahasa Konten *',
                mainIdeaLabel: 'Ide Utama/Alur',
                mainIdeaPlaceholder: 'Jelaskan ide utama, alur, atau konsep yang ingin Anda bangun oleh AI. Ini akan membantu menghasilkan konten yang selaras dengan visi spesifik Anda.',
                generateButton: 'Hasilkan Konten',
                resetButton: 'Reset Semua',
                resetConfirmTitle: 'Reset Semua Data',
                resetConfirmMessage: 'Apakah Anda yakin ingin mereset semua data? Ini akan menghapus formulir dan konten yang dihasilkan.',
                cancelButton: 'Batal',
                resetModalButton: 'Reset',
                generating: 'Menghasilkan konten Anda dengan AI...',
                loadingFacts: [
                    'Tahukah Anda? Pena quill ditemukan pada abad ke-6...',
                    'Membuat cerita Anda dengan presisi AI...',
                    'Quill pertama berasal dari bulu angsa...',
                    'AI sedang menenun masterpiece naratif Anda...',
                    'Para penulis kuno menggunakan pena reed sebelum quill...',
                    'Memoles kata-kata Anda dengan algoritma cerdas...',
                    'Pena quill dapat menulis hingga 10.000 kata per hari...',
                    'Mengubah ide menjadi prosa yang indah...',
                    'Quill merevolusi penulisan di Eropa abad pertengahan...',
                    'Shakespeare menulis 37 drama dan 154 sonnets...',
                    'Mesin tik ditemukan pada tahun 1868...',
                    'AI belajar dari jutaan karya sastra masterpiece...',
                    'Novel terpanjang pernah ditulis berjumlah 9,609,000 kata...',
                    'Penulis terkenal seperti Hemingway menulis sambil berdiri...',
                    'Novel komputer pertama ditulis pada tahun 1952...',
                    'AI dapat menganalisis gaya tulisan penulis mana pun...',
                    'Pena quill digunakan selama lebih dari 1.000 tahun...',
                    'Jane Austen menulis novelnya pada abad ke-19...',
                    'Alat tulis digital berkembang dengan pesat...',
                    'Seni bercerita dimulai sejak gua-gua kuno...',
                    'AI membantu penulis mengatasi blok kreatif...',
                    'Pena fountain pertama ditemukan pada tahun 1884...',
                    'Sastra telah membentuk budaya manusia selama ribuan tahun...',
                    'AI modern melanjutkan tradisi pencerita hebat...',
                    'Menulis dengan tangan meningkatkan memori dan kreativitas...',
                    'Pena ballpoint ditemukan pada tahun 1938...',
                    'AI menganalisis tema, plot, dan perkembangan karakter...',
                    'Mesin cetak merevolusi berbagi pengetahuan...',
                    'Setiap penulis hebat pernah menjadi pemula...',
                    'AI melestarikan tradisi tulis sambil berinovasi...',
                    'Sistem tulis pertama adalah kuneiform, ditemukan bangsa Sumeria sekitar 3500 SM...',
                    'Shakespeare menciptakan 1.700+ kata baru yang masih digunakan dalam bahasa Inggris modern...',
                    'Bentuk novel muncul di Inggris abad ke-18 dengan karya seperti Robinson Crusoe...',
                    'Hieroglif digunakan selama lebih dari 3.000 tahun di Mesir kuno...',
                    'Kamus pertama disusun oleh Robert Cawdrey pada tahun 1604...',
                    'Sanskerta adalah bahasa tertua yang masih terus digunakan di dunia...',
                    'Batu Rosetta membantu memecahkan hieroglif Mesir pada tahun 1799...',
                    'Semua bahasa memiliki pola tata bahasa universal menurut penelitian linguistik...',
                    'Bahasa pemrograman pertama dibuat pada tahun 1883 oleh Ada Lovelace...',
                    'Model bahasa AI kini dapat menerjemahkan antara lebih dari 100 bahasa...',
                    'Kamus Bahasa Inggris Oxford berisi 600.000+ kata dan frasa...',
                    'Edgar Allan Poe menciptakan genre cerita detektif modern...',
                    'Frankenstein (1818) karya Mary Shelley dianggap sebagai novel fiksi ilmiah pertama...',
                    'Pena quill digunakan selama lebih dari 1.000 tahun, dari zaman kuno hingga abad ke-19...',
                    'Para penulis biara melestarikan teks kuno melalui Abad Kegelapan Eropa...',
                    'Surat kabar pertama diterbitkan di Strasbourg pada tahun 1605...',
                    'Dante Alighieri memilih menulis The Divine Comedy dalam bahasa Italia bukan Latin...',
                    'Paten mesin tik pertama diberikan kepada Henry Mill pada tahun 1714...',
                    'AI kini dapat mendeteksi gaya tulisan dengan akurasi lebih dari 95%...',
                    'Buku cetak tertua yang masih ada adalah Diamond Sutra dari tahun 868 M...',
                    'Sistem tulis berevolusi secara independen di setidaknya 4 peradaban kuno...',
                    'E-book pertama dibuat oleh Michael Hart pada tahun 1971...',
                    'Model bahasa AI dilatih dengan miliaran sampel teks dari tulisan manusia...',
                    'Sistem tulis berkembang secara independen di Cina, Mesopotamia, Mesir, dan Mesoamerika...',
                    'Penemuan kertas oleh bangsa Cina merevolusi komunikasi global...',
                    'Kaligrafi menjadi bentuk seni yang sangat dihormati di banyak budaya Asia...',
                    'Mesin cetak pertama ditemukan oleh Johannes Gutenberg pada tahun 1450...',
                    'Sastra telah digunakan sebagai propaganda sejak zaman Romawi kuno...',
                    'Cerita terpendek yang pernah ditulis hanya terdiri dari enam kata...',
                    'Penulisan di atas tablet tanah liat dimulai lebih dari 5.000 tahun yang lalu...',
                    'Novel modern pertama dianggap sebagai Don Quixote karya Cervantes...',
                    'Penulisan membantu melestarikan tradisi lisan dan sejarah budaya...',
                    'Ensiklopedia pertama diterbitkan di Cina selama Dinasti Ming...',
                    'Tipografi berkembang dari naskah tulisan tangan ke font digital...',
                    'Sistem tulis menggunakan antara 20 hingga 100 simbol untuk komunikasi lengkap...',
                    'Hukum hak cipta pertama didirikan di Inggris pada tahun 1710...',
                    'Sastra mencerminkan iklim sosial dan politik zamannya...',
                    'Alat tulis berkembang dari stylus batu ke keyboard komputer...',
                    'Surat kabar pertama diterbitkan di Jerman pada tahun 1609...',
                    'Dongeng awalnya adalah cerita lisan sebelum ditulis...',
                    'Penulisan memungkinkan perjalanan waktu melalui pikiran manusia yang terlestarikan...',
                    'Perpustakaan umum pertama didirikan di Nineveh kuno...'
                ],
                apiKeyRequired: 'Silakan atur kunci API Gemini Anda di Pengaturan terlebih dahulu.',
                missingFields: 'Kolom yang diperlukan tidak lengkap',
                tagsRequired: 'Silakan tambahkan setidaknya satu tag',
                exportMarkdown: 'Ekspor sebagai Markdown',
                exportRTF: 'Ekspor sebagai RTF',
                generateChapter: 'Hasilkan Konten Bab',
                generatingChapter: 'Menghasilkan...',
                regenerateChapter: 'Hasilkan Ulang Bab',
                exportChapter: 'Ekspor Bab',
                selectTitle: 'Pilih Judul',
                selectSubtitle: 'Pilih Subjudul',
                novelTitle: 'Judul Novel',
                synopsis: 'Sinopsis',
                outline: 'Outline',
                chapter: 'Bab',
                refinedTags: 'Tag yang Dimurnikan',
                content: 'Konten',
                backToGenerator: '← Kembali ke Generator',
                languageSettings: 'Pengaturan Bahasa',
                interfaceLanguage: 'Bahasa Antarmuka',
                languageHelp: 'Pilih bahasa untuk antarmuka pengguna',
                apiConfiguration: 'Konfigurasi Gemini AI',
                getApiKey: 'Cara mendapatkan kunci API:',
                apiSteps: ['Kunjungi Google AI Studio', 'Masuk dengan akun Google Anda', 'Buat kunci API baru', 'Salin kunci dan tempel di bawah'],
                apiKeyLabel: 'Kunci API Gemini *',
                apiKeyPlaceholder: 'Masukkan kunci API Gemini Anda',
                saveApiKey: 'Simpan Kunci API',
                apiKeySaved: 'Kunci API berhasil disimpan!',
                apiKeyVerified: 'Kunci API diverifikasi dan berhasil disimpan!',
                apiKeyVerificationFailed: 'Kunci API disimpan tetapi verifikasi gagal: ',
                apiKeySaveError: 'Kunci API disimpan tetapi tidak dapat diverifikasi: ',
                apiKeyQuotaExceeded: 'Kuota API terlampaui. Silakan periksa tagihan/batas Gemini API Anda.',
                apiKeyInvalid: 'Kunci API tidak valid. Silakan periksa bahwa kunci API Gemini Anda benar dan diaktifkan.',
                networkError: 'Kesalahan jaringan. Silakan periksa koneksi internet Anda dan coba lagi.',
                pleaseEnterApiKey: 'Silakan masukkan kunci API'
            }
        };

        // Form handling and UI logic
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('articleForm');
            const typeSelect = document.getElementById('type');
            const chapterCountGroup = document.getElementById('chapterCountGroup');
            const authorStyleSelect = document.getElementById('authorStyle');
            const customAuthorStyle = document.getElementById('customAuthorStyle');
            const newspaperStyleGroup = document.getElementById('newspaperStyleGroup');
            const newspaperStyleSelect = document.getElementById('newspaperStyle');
            const customNewspaperStyle = document.getElementById('customNewspaperStyle');
            const generateBtn = document.getElementById('generateBtn');
            const loading = document.getElementById('loading');
            const errorMessage = document.getElementById('errorMessage');
            const resultContainer = document.getElementById('resultContainer');
            const modal = document.getElementById('confirmationModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalMessage = document.getElementById('modalMessage');
            const modalCancel = document.getElementById('modalCancel');
            const modalConfirm = document.getElementById('modalConfirm');
            // Load saved language preference
            const savedLanguage = localStorage.getItem('uiLanguage') || 'english';

            // Function to update UI language
            function updateUILanguage(lang) {
                const texts = uiLanguages[lang];
                document.querySelector('h1').textContent = texts.title;
                document.querySelector('p').textContent = texts.subtitle;
                document.querySelector('.settings-link').textContent = texts.settings;
                document.querySelector('label[for="topic"]').textContent = texts.topicLabel;
                document.querySelector('#topic').placeholder = texts.topicPlaceholder;
                document.querySelector('label[for="tags"]').textContent = texts.tagsLabel;
                document.querySelector('#tagInput').placeholder = texts.tagsPlaceholder;
                document.querySelector('#addTagBtn').textContent = texts.addButton;
                document.querySelector('label[for="keywords"]').textContent = texts.keywordsLabel;
                document.querySelector('#keywordInput').placeholder = texts.keywordsPlaceholder;
                document.querySelector('#addKeywordBtn').textContent = texts.addButton;
                document.querySelector('label[for="authorStyle"]').textContent = texts.authorStyleLabel;
                document.querySelector('#authorStyle option[value=""]').textContent = texts.selectAuthor;
                document.querySelector('#customAuthorStyle').placeholder = texts.customAuthorPlaceholder;
                document.querySelector('label[for="newspaperStyle"]').textContent = texts.newspaperStyleLabel;
                document.querySelector('#newspaperStyle option[value=""]').textContent = texts.selectNewspaper;
                document.querySelector('#customNewspaperStyle').placeholder = texts.customNewspaperPlaceholder;
                document.querySelector('label[for="type"]').textContent = texts.typeLabel;
                document.querySelector('#type option[value="article"]').textContent = texts.typeArticle;
                document.querySelector('#type option[value="shortstory"]').textContent = texts.typeShortStory;
                document.querySelector('#type option[value="news"]').textContent = texts.typeNews;
                document.querySelector('#type option[value="novel"]').textContent = texts.typeNovel;
                document.querySelector('label[for="chapterCount"]').textContent = texts.chapterCountLabel;
                document.querySelector('#chapterCount').placeholder = texts.chapterCountPlaceholder;
                document.querySelector('label[for="language"]').textContent = texts.languageLabel;
                document.querySelector('#language option[value=""]').textContent = texts.selectLanguage;
                document.querySelector('label[for="mainIdea"]').textContent = texts.mainIdeaLabel;
                document.querySelector('#mainIdea').placeholder = texts.mainIdeaPlaceholder;
                document.querySelector('#generateBtn').textContent = texts.generateButton;
                document.querySelector('#resetBtn').textContent = texts.resetButton;
                // Only update loading text if not currently cycling through facts
                if (!loadingInterval) {
                    document.querySelector('#loading p').textContent = texts.generating;
                }

                // Store language preference
                localStorage.setItem('uiLanguage', lang);
            }

            // Loading text cycling functionality
            let loadingInterval;
            let shuffledFacts = [];
            let currentFactIndex = 0;

            function shuffleArray(array) {
                const shuffled = [...array];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                return shuffled;
            }

            function startLoadingFacts(lang) {
                const texts = uiLanguages[lang];
                const facts = texts.loadingFacts;
                if (!facts || facts.length === 0) return;

                // Shuffle facts for random order each time
                shuffledFacts = shuffleArray(facts);
                currentFactIndex = 0;
                const loadingTextElement = document.querySelector('#loading p');

                // Show first fact immediately
                loadingTextElement.textContent = shuffledFacts[0];

                // Start cycling through shuffled facts with varied timing
                loadingInterval = setInterval(() => {
                    currentFactIndex = (currentFactIndex + 1) % shuffledFacts.length;
                    loadingTextElement.textContent = shuffledFacts[currentFactIndex];
                }, 2800 + Math.random() * 800); // Random timing between 2.8-3.6 seconds
            }

            function stopLoadingFacts() {
                if (loadingInterval) {
                    clearInterval(loadingInterval);
                    loadingInterval = null;
                    // Reset to default generating text
                    const currentLang = localStorage.getItem('uiLanguage') || 'english';
                    const texts = uiLanguages[currentLang];
                    document.querySelector('#loading p').textContent = texts.generating;
                }
            }

            // Initialize language
            updateUILanguage(savedLanguage);

            // Tag and keyword management
            let tags = [];
            let keywords = [];

            function setupTagSystem(inputId, containerId, array, addBtnId) {
                const input = document.getElementById(inputId);
                const container = document.getElementById(containerId);
                const addBtn = document.getElementById(addBtnId);

                function addItem(value) {
                    if (value && !array.includes(value)) {
                        array.push(value);
                        renderItems();
                        input.value = '';
                    }
                }

                function removeItem(index) {
                    array.splice(index, 1);
                    renderItems();
                }

                function renderItems() {
                    container.innerHTML = '';
                    array.forEach((item, index) => {
                        const tagElement = document.createElement('div');
                        tagElement.className = 'tag';
                        tagElement.innerHTML = \`
                            \${item}
                            <span class="tag-remove" onclick="removeItem(\${index}, '\${array === tags ? 'tags' : 'keywords'}')">&times;</span>
                        \`;
                        container.appendChild(tagElement);
                    });
                }

                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        addItem(input.value.trim());
                    }
                });

                addBtn.addEventListener('click', function() {
                    addItem(input.value.trim());
                });

                // Make removeItem available globally for onclick
                window.removeItem = function(index, type) {
                    if (type === 'tags') {
                        tags.splice(index, 1);
                        renderItems();
                    } else {
                        keywords.splice(index, 1);
                        renderItems();
                    }
                };
            }

            setupTagSystem('tagInput', 'tagsContainer', tags, 'addTagBtn');
            setupTagSystem('keywordInput', 'keywordsContainer', keywords, 'addKeywordBtn');

            // Persistence functions
            function saveFormData() {
                const formData = {
                    topic: document.getElementById('topic').value,
                    authorStyle: document.getElementById('authorStyle').value,
                    customAuthorStyle: document.getElementById('customAuthorStyle').value,
                    type: document.getElementById('type').value,
                    newspaperStyle: document.getElementById('newspaperStyle').value,
                    customNewspaperStyle: document.getElementById('customNewspaperStyle').value,
                    language: document.getElementById('language').value,
                    chapterCount: document.getElementById('chapterCount').value,
                    mainIdea: document.getElementById('mainIdea').value,
                    tags: tags,
                    keywords: keywords
                };
                localStorage.setItem('quillFormData', JSON.stringify(formData));
            }

            function loadFormData() {
                const savedData = localStorage.getItem('quillFormData');
                if (savedData) {
                    const formData = JSON.parse(savedData);

                    document.getElementById('topic').value = formData.topic || '';
                    document.getElementById('authorStyle').value = formData.authorStyle || '';
                    document.getElementById('customAuthorStyle').value = formData.customAuthorStyle || '';
                    document.getElementById('type').value = formData.type || '';
                    document.getElementById('newspaperStyle').value = formData.newspaperStyle || '';
                    document.getElementById('customNewspaperStyle').value = formData.customNewspaperStyle || '';
                    document.getElementById('language').value = formData.language || '';
                    document.getElementById('chapterCount').value = formData.chapterCount || '';
                    document.getElementById('mainIdea').value = formData.mainIdea || '';

                    // Restore tags and keywords
                    if (formData.tags) {
                        tags.length = 0;
                        tags.push(...formData.tags);
                    }
                    if (formData.keywords) {
                        keywords.length = 0;
                        keywords.push(...formData.keywords);
                    }

                    // Update UI for tags and keywords
                    setupTagSystem('tagInput', 'tagsContainer', tags, 'addTagBtn');
                    setupTagSystem('keywordInput', 'keywordsContainer', keywords, 'addKeywordBtn');

                    // Show/hide chapter count group based on type
                    const chapterCountGroup = document.getElementById('chapterCountGroup');
                    if (formData.type === 'novel') {
                        chapterCountGroup.classList.add('show');
                    } else {
                        chapterCountGroup.classList.remove('show');
                    }

                    // Show/hide custom author style
                    const customAuthorStyle = document.getElementById('customAuthorStyle');
                    if (formData.authorStyle === 'custom') {
                        customAuthorStyle.style.display = 'block';
                        customAuthorStyle.required = true;
                    } else {
                        customAuthorStyle.style.display = 'none';
                        customAuthorStyle.required = false;
                    }

                    // Show/hide newspaper style group based on type
                    const newspaperStyleGroup = document.getElementById('newspaperStyleGroup');
                    if (formData.type === 'news') {
                        newspaperStyleGroup.style.display = 'block';
                        document.getElementById('newspaperStyle').required = true;
                    } else {
                        newspaperStyleGroup.style.display = 'none';
                        document.getElementById('newspaperStyle').required = false;
                    }

                    // Show/hide custom newspaper style
                    const customNewspaperStyle = document.getElementById('customNewspaperStyle');
                    if (formData.newspaperStyle === 'custom') {
                        customNewspaperStyle.style.display = 'block';
                        customNewspaperStyle.required = true;
                    } else {
                        customNewspaperStyle.style.display = 'none';
                        customNewspaperStyle.required = false;
                    }
                }
            }

            function saveResults(result, type) {
                const resultsData = {
                    result: result,
                    type: type,
                    timestamp: Date.now()
                };
                localStorage.setItem('quillResults', JSON.stringify(resultsData));
            }

            function loadResults() {
                const savedResults = localStorage.getItem('quillResults');
                if (savedResults) {
                    const resultsData = JSON.parse(savedResults);
                    displayResults(resultsData.result, resultsData.type);
                    // Show reset button when results are loaded
                    document.getElementById('resetBtn').classList.remove('hidden');
                }
            }

            function clearAllData() {
                localStorage.removeItem('quillFormData');
                localStorage.removeItem('quillResults');

                // Clear form
                document.getElementById('articleForm').reset();
                tags.length = 0;
                keywords.length = 0;

                // Clear UI
                document.getElementById('tagsContainer').innerHTML = '';
                document.getElementById('keywordsContainer').innerHTML = '';
                document.getElementById('chapterCountGroup').classList.remove('show');
                document.getElementById('customAuthorStyle').style.display = 'none';
                document.getElementById('customAuthorStyle').required = false;
                document.getElementById('newspaperStyleGroup').style.display = 'none';
                document.getElementById('newspaperStyle').required = false;
                document.getElementById('customNewspaperStyle').style.display = 'none';
                document.getElementById('customNewspaperStyle').required = false;

                // Clear results
                document.getElementById('resultContainer').innerHTML = '';
                document.getElementById('resultContainer').style.display = 'none';

                // Clear error messages
                document.getElementById('errorMessage').style.display = 'none';

                // Hide reset button
                document.getElementById('resetBtn').classList.add('hidden');
            }

            // Type selection handling
            typeSelect.addEventListener('change', function() {
                if (this.value === 'novel') {
                    chapterCountGroup.classList.add('show');
                } else {
                    chapterCountGroup.classList.remove('show');
                }

                if (this.value === 'news') {
                    newspaperStyleGroup.style.display = 'block';
                    document.getElementById('newspaperStyle').required = true;
                } else {
                    newspaperStyleGroup.style.display = 'none';
                    document.getElementById('newspaperStyle').required = false;
                }
            });

            // Author style handling
            authorStyleSelect.addEventListener('change', function() {
                if (this.value === 'custom') {
                    customAuthorStyle.style.display = 'block';
                    customAuthorStyle.required = true;
                } else {
                    customAuthorStyle.style.display = 'none';
                    customAuthorStyle.required = false;
                }
                saveFormData();
            });

            // Newspaper style handling
            newspaperStyleSelect.addEventListener('change', function() {
                if (this.value === 'custom') {
                    customNewspaperStyle.style.display = 'block';
                    customNewspaperStyle.required = true;
                } else {
                    customNewspaperStyle.style.display = 'none';
                    customNewspaperStyle.required = false;
                }
                saveFormData();
            });

            // Type selection handling
            typeSelect.addEventListener('change', function() {
                if (this.value === 'novel') {
                    chapterCountGroup.classList.add('show');
                } else {
                    chapterCountGroup.classList.remove('show');
                }
                saveFormData();
            });

            // Add auto-save functionality to all form inputs
            const formInputs = document.querySelectorAll('input, select, textarea');
            formInputs.forEach(input => {
                input.addEventListener('input', saveFormData);
                input.addEventListener('change', saveFormData);
            });

            // Modal functionality
            function showModal(title, message, onConfirm) {
                modalTitle.textContent = title;
                modalMessage.textContent = message;
                modal.classList.add('show');

                function closeModal() {
                    modal.classList.remove('show');
                }

                modalCancel.onclick = closeModal;

                modalConfirm.onclick = function() {
                    closeModal();
                    onConfirm();
                };

                // Close on overlay click
                modal.onclick = function(e) {
                    if (e.target === modal) {
                        closeModal();
                    }
                };

                // Close on Escape key
                document.addEventListener('keydown', function escHandler(e) {
                    if (e.key === 'Escape') {
                        closeModal();
                        document.removeEventListener('keydown', escHandler);
                    }
                });
            }

            // Reset button functionality
            document.getElementById('resetBtn').addEventListener('click', function() {
                const currentLang = localStorage.getItem('uiLanguage') || 'english';
                const texts = uiLanguages[currentLang];

                showModal(texts.resetConfirmTitle || 'Reset All Data',
                         texts.resetConfirmMessage,
                         function() {
                    clearAllData();
                }, texts.cancelButton || 'Cancel', texts.resetModalButton || 'Reset');
            });

            function showError(message) {
                errorMessage.textContent = message;
                errorMessage.style.display = 'block';
                errorMessage.scrollIntoView({ behavior: 'smooth' });
            }

            // Form submission
            form.addEventListener('submit', async function(e) {
                e.preventDefault();

                const formData = new FormData(form);
                const apiKey = localStorage.getItem('geminiApiKey');
                if (!apiKey) {
                    const currentLang = localStorage.getItem('uiLanguage') || 'english';
                    showError(uiLanguages[currentLang].apiKeyRequired);
                    return;
                }

                const data = {
                    topic: formData.get('topic'),
                    tags: tags.length > 0 ? tags : ['writing', 'content', 'creative'],
                    keywords: keywords.length > 0 ? keywords : ['writing', 'content', 'creation'],
                    authorStyle: authorStyleSelect.value === 'custom' ? customAuthorStyle.value : authorStyleSelect.value,
                    type: formData.get('type'),
                    newspaperStyle: newspaperStyleSelect.value === 'custom' ? customNewspaperStyle.value : newspaperStyleSelect.value,
                    chapterCount: formData.get('chapterCount') ? parseInt(formData.get('chapterCount')) : undefined,
                    language: formData.get('language'),
                    mainIdea: formData.get('mainIdea') || undefined,
                    apiKey: apiKey
                };

                // Show loading
                loading.style.display = 'block';
                generateBtn.disabled = true;
                errorMessage.style.display = 'none';
                resultContainer.style.display = 'none';

                // Start cycling loading facts
                const currentLang = localStorage.getItem('uiLanguage') || 'english';
                startLoadingFacts(currentLang);

                try {
                    const response = await fetch('/api/generate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    });

                    const result = await response.json();

                    if (!response.ok) {
                        throw new Error(result.error || 'Failed to generate content');
                    }

                    displayResults(result, data.type);
                    saveResults(result, data.type);

                    // Show reset button when content is generated
                    document.getElementById('resetBtn').classList.remove('hidden');
                } catch (error) {
                    const currentLang = localStorage.getItem('uiLanguage') || 'english';
                    const texts = uiLanguages[currentLang];
                    let errorMessage = error.message;

                    // Provide more user-friendly error messages
                    if (error.message.includes('quota exceeded') || error.message.includes('429')) {
                        errorMessage = texts.apiKeyQuotaExceeded;
                    } else if (error.message.includes('403') || error.message.includes('access denied') || error.message.includes('unauthorized')) {
                        errorMessage = texts.apiKeyInvalid;
                    } else if (error.message.includes('network') || error.message.includes('fetch')) {
                        errorMessage = texts.networkError;
                    }

                    showError(errorMessage);
                } finally {
                    loading.style.display = 'none';
                    generateBtn.disabled = false;
                    // Stop cycling loading facts
                    stopLoadingFacts();
                }
            });

            function displayResults(result, type) {
                resultContainer.innerHTML = '';

                if (type === 'article' || type === 'shortstory' || type === 'news') {
                    displayArticleResults(result);
                } else {
                    displayNovelResults(result);
                }

                resultContainer.style.display = 'block';
                resultContainer.scrollIntoView({ behavior: 'smooth' });
            }

            function displayArticleResults(result) {
                const currentLang = localStorage.getItem('uiLanguage') || 'english';
                const texts = uiLanguages[currentLang];
                let html = '';

                if (result.refinedTags && result.refinedTags.length > 0) {
                    html += \`
                        <div class="result-section">
                            <h3>\${texts.refinedTags}</h3>
                            <div class="tags-container">
                                \${result.refinedTags.map(tag => \`<div class="tag">\${tag}</div>\`).join('')}
                            </div>
                        </div>
                    \`;
                }

                if (result.titleSelection && result.titleSelection.length > 0) {
                    html += \`
                        <div class="result-section">
                            <h3>\${texts.selectTitle}</h3>
                            <div class="title-options">
                                \${result.titleSelection.map((title, index) =>
                                    \`<div class="option-card" onclick="selectOption(this, 'title', \${index})">
                                        <div class="option-title">Option \${index + 1}</div>
                                        <div>\${title}</div>
                                    </div>\`
                                ).join('')}
                            </div>
                        </div>
                    \`;
                }

                if (result.subtitleSelection && result.subtitleSelection.length > 0) {
                    html += \`
                        <div class="result-section">
                            <h3>\${texts.selectSubtitle}</h3>
                            <div class="title-options">
                                \${result.subtitleSelection.map((subtitle, index) =>
                                    \`<div class="option-card" onclick="selectOption(this, 'subtitle', \${index})">
                                        <div class="option-title">Option \${index + 1}</div>
                                        <div>\${subtitle}</div>
                                    </div>\`
                                ).join('')}
                            </div>
                        </div>
                    \`;
                }

                if (result.content) {
                    html += \`
                        <div class="result-section">
                            <h3>\${texts.content}</h3>
                            <div class="content-display">\${result.content}</div>
                        </div>

                        <div class="export-section">
                            <h3>Export Your Content</h3>
                            <div class="export-controls">
                                <select id="selectedTitle" class="export-select">
                                    <option value="">\${texts.selectTitle}...</option>
                                    \${result.titleSelection ? result.titleSelection.map((title, index) =>
                                        \`<option value="\${title}">\${title}</option>\`
                                    ).join('') : ''}
                                </select>
                                <select id="selectedSubtitle" class="export-select">
                                    <option value="">\${texts.selectSubtitle}...</option>
                                    \${result.subtitleSelection ? result.subtitleSelection.map((subtitle, index) =>
                                        \`<option value="\${subtitle}">\${subtitle}</option>\`
                                    ).join('') : ''}
                                </select>
                            </div>
                            <div class="export-buttons">
                                <button class="export-btn" onclick="exportAsMarkdown()">
                                    📄 \${texts.exportMarkdown}
                                </button>
                                <button class="export-btn" onclick="exportAsRTF()">
                                    📝 \${texts.exportRTF || 'Export as RTF'}
                                </button>
                            </div>
                        </div>
                    \`;
                }

                resultContainer.innerHTML = html;
            }

            function displayNovelResults(result) {
                const currentLang = localStorage.getItem('uiLanguage') || 'english';
                const texts = uiLanguages[currentLang];
                let html = '';

                if (result.titleSelection && result.titleSelection.length > 0) {
                    html += \`
                        <div class="result-section">
                            <h3>\${texts.selectTitle}</h3>
                            <div class="title-options">
                                \${result.titleSelection.map((title, index) =>
                                    \`<div class="option-card" onclick="selectOption(this, 'title', \${index})">
                                        <div class="option-title">Option \${index + 1}</div>
                                        <div>\${title}</div>
                                    </div>\`
                                ).join('')}
                            </div>
                        </div>
                    \`;
                }

                if (result.synopsis) {
                    html += \`
                        <div class="result-section">
                            <h3>\${texts.synopsis}</h3>
                            <div class="content-display">\${result.synopsis}</div>
                        </div>
                    \`;
                }

                if (result.outline && result.outline.length > 0) {
                    html += \`
                        <div class="result-section">
                            <h3>\${texts.outline}</h3>
                            <div class="chapter-outline">
                                  \${result.outline.map(chapter => \`
                                      <div class="chapter-item">
                                        <div class="chapter-header" onclick="toggleChapter(\${chapter.chapterNumber})">
                                            <div class="chapter-title-section">
                                                <div class="chapter-number">\${texts.chapter} \${chapter.chapterNumber}: \${chapter.title}</div>
                                                <div>\${chapter.subtitle}</div>
                                            </div>
                                            <div class="chapter-toggle collapsed" id="chapter-toggle-\${chapter.chapterNumber}">▶</div>
                                        </div>
                                        <div class="chapter-content-section" id="chapter-content-section-\${chapter.chapterNumber}">
                                            <div class="chapter-details">
                                                <div class="chapter-actions">
                                                    <button class="generate-chapter-btn"
                                                            data-chapter-number="\${chapter.chapterNumber}"
                                                            data-chapter-title="\${chapter.title.split('"').join('&quot;')}"
                                                            data-chapter-subtitle="\${chapter.subtitle.split('"').join('&quot;')}"
                                                            data-novel-title="\${result.titleSelection ? result.titleSelection[0].split('"').join('&quot;') : ''}"
                                                            data-novel-synopsis="\${result.synopsis ? result.synopsis.substring(0, 100).split('"').join('&quot;') : ''}"
                                                            onclick="generateChapter(this)">
                                                        \${texts.generateChapter}
                                                    </button>
                                                    <div class="export-chapter-buttons" id="export-chapter-\${chapter.chapterNumber}-btn" style="display: none;">
                                                        <button class="export-chapter-btn"
                                                            data-chapter-number="\${chapter.chapterNumber}"
                                                            data-chapter-title="\${chapter.title.split('"').join('&quot;')}"
                                                            data-chapter-subtitle="\${chapter.subtitle.split('"').join('&quot;')}"
                                                            onclick="exportChapterMarkdown(this)">
                                                            📄 MD
                                                        </button>
                                                        <button class="export-chapter-btn"
                                                            data-chapter-number="\${chapter.chapterNumber}"
                                                            data-chapter-title="\${chapter.title.split('"').join('&quot;')}"
                                                            data-chapter-subtitle="\${chapter.subtitle.split('"').join('&quot;')}"
                                                            onclick="exportChapterRTF(this)">
                                                            📝 RTF
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="chapter-loading" id="chapter-\${chapter.chapterNumber}-loading" style="display: none;">
                                                    <div class="chapter-progress-bar"></div>
                                                </div>
                                                <div class="chapter-content" id="chapter-\${chapter.chapterNumber}-content" style="display: none;"></div>
                                            </div>
                                        </div>
                                      </div>
                                  \`).join('')}
                            </div>
                        </div>

                        <div class="export-section">
                            <h3>Export Your Novel</h3>
                            <div class="export-controls">
                                <select id="selectedNovelTitle" class="export-select">
                                    <option value="">\${texts.selectTitle}...</option>
                                    \${result.titleSelection ? result.titleSelection.map((title, index) =>
                                        \`<option value="\${title}">\${title}</option>\`
                                    ).join('') : ''}
                                </select>
                            </div>
                            <div class="export-buttons">
                                <button class="export-btn" onclick="exportNovelAsMarkdown()">
                                    📄 \${texts.exportMarkdown}
                                </button>
                            </div>
                        </div>
                    \`;
                }

                resultContainer.innerHTML = html;
            }

            // Load saved data on page load
            loadFormData();
            loadResults();
        });

        function selectOption(element, type, index) {
            // Remove selected class from all options of this type
            const container = element.closest('.title-options, .subtitle-options');
            container.querySelectorAll('.option-card').forEach(card => {
                card.classList.remove('selected');
            });

            // Add selected class to clicked option
            element.classList.add('selected');
        }

        function exportAsMarkdown() {
            const selectedTitle = document.getElementById('selectedTitle').value;
            const selectedSubtitle = document.getElementById('selectedSubtitle').value;

            if (!selectedTitle) {
                alert('Please select a title first.');
                return;
            }

            // Get the content from the result
            const contentElement = document.querySelector('.content-display');
            if (!contentElement) {
                alert('No content found to export.');
                return;
            }

            const content = contentElement.textContent || contentElement.innerText;

            // Create markdown content
            let markdown = \`# \${selectedTitle}\n\n\`;
            if (selectedSubtitle) {
                markdown += \`## \${selectedSubtitle}\n\n\`;
            }
            markdown += content;

            // Create and download file
            const blob = new Blob([markdown], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = \`\${selectedTitle.replace(/[^a-z0-9]/g, '_').toLowerCase()}.md\`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        async function exportAsRTF() {
            const selectedTitle = document.getElementById('selectedTitle').value;
            const selectedSubtitle = document.getElementById('selectedSubtitle').value;

            if (!selectedTitle) {
                const currentLang = localStorage.getItem('uiLanguage') || 'english';
                const texts = uiLanguages[currentLang];
                alert(texts.selectTitle || 'Please select a title first.');
                return;
            }

            // Get the content from the result
            const contentElement = document.querySelector('.content-display');
            if (!contentElement) {
                alert('No content found to export.');
                return;
            }

            const content = contentElement.textContent || contentElement.innerText;

            try {
                const response = await fetch('/api/export-rtf', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: selectedTitle,
                        subtitle: selectedSubtitle || '',
                        content: content
                    })
                });

                if (!response.ok) {
                    throw new Error('Export failed');
                }

                // Create download link for RTF file
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = \`\${selectedTitle.replace(/[^a-z0-9]/g, '_').toLowerCase()}.rtf\`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

            } catch (error) {
                console.error('RTF export error:', error);
                alert('RTF export failed. Please try again.');
            }
        }


        function toggleChapter(chapterNumber) {
            const contentSection = document.getElementById(\`chapter-content-section-\${chapterNumber}\`);
            const toggleButton = document.getElementById(\`chapter-toggle-\${chapterNumber}\`);

            if (contentSection.classList.contains('expanded')) {
                // Collapse
                contentSection.classList.remove('expanded');
                toggleButton.classList.remove('expanded');
                toggleButton.classList.add('collapsed');
                toggleButton.textContent = '▶';
            } else {
                // Expand
                contentSection.classList.add('expanded');
                toggleButton.classList.remove('collapsed');
                toggleButton.classList.add('expanded');
                toggleButton.textContent = '▼';
            }
        }

        async function generateChapter(button) {
            const chapterNumber = parseInt(button.getAttribute('data-chapter-number'));
            const chapterTitle = button.getAttribute('data-chapter-title');
            const chapterSubtitle = button.getAttribute('data-chapter-subtitle');
            const novelTitle = button.getAttribute('data-novel-title');
            const novelSynopsis = button.getAttribute('data-novel-synopsis');

            const loadingDiv = document.getElementById(\`chapter-\${chapterNumber}-loading\`);
            const contentDiv = document.getElementById(\`chapter-\${chapterNumber}-content\`);

            // Get the API key from localStorage
            const apiKey = localStorage.getItem('geminiApiKey');
            if (!apiKey) {
                alert('Please set your Gemini API key in Settings first.');
                return;
            }

            // Show loading state
            button.disabled = true;
            const currentLang = localStorage.getItem('uiLanguage') || 'english';
            const texts = uiLanguages[currentLang];
            button.textContent = texts.generatingChapter;
            loadingDiv.style.display = 'flex';

            try {
                // Collect previous chapters data for context
                const previousChapters = collectPreviousChapters(chapterNumber);

                const response = await fetch('/api/generate-chapter', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chapterNumber: chapterNumber,
                        chapterTitle: chapterTitle,
                        chapterSubtitle: chapterSubtitle,
                        novelTitle: novelTitle,
                        novelSynopsis: novelSynopsis,
                        previousChapters: previousChapters,
                        apiKey: apiKey
                    })
                });

                if (!response.ok) {
                    throw new Error('Chapter generation failed');
                }

                const result = await response.json();

                // Hide loading, show content
                loadingDiv.style.display = 'none';
                contentDiv.style.display = 'block';
                contentDiv.innerHTML = result.content.replace(new RegExp('\\n', 'g'), '<br>');

                // Store chapter content for future context
                storeChapterContent(chapterNumber, chapterTitle, result.content);

                // Show export button
                const exportBtn = document.getElementById(\`export-chapter-\${chapterNumber}-btn\`);
                if (exportBtn) {
                    exportBtn.style.display = 'inline-flex';
                }

                // Auto-expand the chapter to show the generated content with a small delay for smooth animation
                setTimeout(() => {
                const contentSection = document.getElementById(\`chapter-content-section-\${chapterNumber}\`);
                const toggleButton = document.getElementById(\`chapter-toggle-\${chapterNumber}\`);
                if (!contentSection.classList.contains('expanded')) {
                    toggleChapter(chapterNumber);
                }
                }, 100);

                // Update button
                const currentLang = localStorage.getItem('uiLanguage') || 'english';
                const texts = uiLanguages[currentLang];
                button.textContent = texts.regenerateChapter;
                button.disabled = false;

            } catch (error) {
                alert('Chapter generation failed. Please try again.');
                console.error('Chapter generation error:', error);

                // Reset button and hide loading
                const currentLang = localStorage.getItem('uiLanguage') || 'english';
                const texts = uiLanguages[currentLang];
                button.disabled = false;
                button.textContent = texts.generateChapter;
                loadingDiv.style.display = 'none';
            }
        }

        // Helper functions for chapter context management
        function collectPreviousChapters(currentChapterNumber) {
            const previousChapters = [];

            // Get all chapter items
            const chapterItems = document.querySelectorAll('.chapter-item');
            chapterItems.forEach((item, index) => {
                const chapterNum = index + 1;
                if (chapterNum < currentChapterNumber) {
                    const chapterTitleElement = item.querySelector('.chapter-number');
                    const chapterTitle = (chapterTitleElement && chapterTitleElement.textContent) ? chapterTitleElement.textContent : 'Chapter ' + chapterNum;
                    const contentElement = document.getElementById('chapter-' + chapterNum + '-content');

                    if (contentElement && contentElement.style.display !== 'none') {
                        const content = contentElement.textContent || contentElement.innerText;
                        if (content && content.length > 50) { // Only include substantial content
                            // Extract key events from the chapter content
                            const keyEvents = extractKeyEvents(content);

                            previousChapters.push({
                                chapterNumber: chapterNum,
                                title: chapterTitle,
                                content: content,
                                keyEvents: keyEvents
                            });
                        }
                    }
                }
            });

            return previousChapters;
        }

        function storeChapterContent(chapterNumber, chapterTitle, content) {
            // Store in localStorage with novel context
            const novelKey = 'novel_' + Date.now(); // Use timestamp as novel identifier
            const chapterKey = novelKey + '_chapter_' + chapterNumber;

            const chapterData = {
                chapterNumber: chapterNumber,
                title: chapterTitle,
                content: content,
                timestamp: Date.now()
            };

            localStorage.setItem(chapterKey, JSON.stringify(chapterData));
        }

        function extractKeyEvents(content) {
            // Simple extraction of potential key events from chapter content
            const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
            const keyEvents = [];

            // Look for sentences that might indicate plot progression
            sentences.forEach(sentence => {
                const trimmed = sentence.trim();
                // Look for action-oriented sentences or revelations
                if (trimmed.length > 30 && (
                    trimmed.includes('discovered') ||
                    trimmed.includes('revealed') ||
                    trimmed.includes('realized') ||
                    trimmed.includes('decided') ||
                    trimmed.includes('confronted') ||
                    trimmed.includes('arrived') ||
                    trimmed.includes('found') ||
                    trimmed.includes('learned')
                )) {
                    keyEvents.push(trimmed.substring(0, 200) + (trimmed.length > 200 ? '...' : ''));
                }
            });

            return keyEvents.slice(0, 5); // Limit to 5 key events per chapter
        }

        async function exportChapterMarkdown(button) {
            const chapterNumber = parseInt(button.getAttribute('data-chapter-number'));
            const chapterTitle = button.getAttribute('data-chapter-title');
            const chapterSubtitle = button.getAttribute('data-chapter-subtitle');

            const contentElement = document.getElementById(\`chapter-\${chapterNumber}-content\`);

            if (!contentElement || contentElement.style.display === 'none') {
                const currentLang = localStorage.getItem('uiLanguage') || 'english';
                const texts = uiLanguages[currentLang];
                alert(texts.chapterNotGenerated || 'No chapter content found to export. Please generate the chapter first.');
                return;
            }

            const content = contentElement.textContent || contentElement.innerText;

            // Export as Markdown (client-side)
            const markdown = \`# Chapter \${chapterNumber}: \${chapterTitle}\n\n## \${chapterSubtitle}\n\n\${content}\n\n---\n\`;

            const blob = new Blob([markdown], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = \`\${chapterTitle.replace(/[^a-z0-9]/g, '_').toLowerCase()}_chapter_\${chapterNumber}.md\`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        async function exportChapterRTF(button) {
            const chapterNumber = parseInt(button.getAttribute('data-chapter-number'));
            const chapterTitle = button.getAttribute('data-chapter-title');
            const chapterSubtitle = button.getAttribute('data-chapter-subtitle');

            const contentElement = document.getElementById(\`chapter-\${chapterNumber}-content\`);

            if (!contentElement || contentElement.style.display === 'none') {
                const currentLang = localStorage.getItem('uiLanguage') || 'english';
                const texts = uiLanguages[currentLang];
                alert(texts.chapterNotGenerated || 'No chapter content found to export. Please generate the chapter first.');
                return;
            }

            const content = contentElement.textContent || contentElement.innerText;

            try {
                const response = await fetch('/api/export-chapter-rtf', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chapterNumber: chapterNumber,
                        chapterTitle: chapterTitle,
                        chapterSubtitle: chapterSubtitle,
                        content: content
                    })
                });

                if (!response.ok) {
                    throw new Error('Chapter RTF export failed');
                }

                // Create download link for RTF file
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = \`\${chapterTitle.replace(/[^a-z0-9]/g, '_').toLowerCase()}_chapter_\${chapterNumber}.rtf\`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

            } catch (error) {
                console.error('Chapter RTF export error:', error);
                alert('Chapter RTF export failed. Please try again.');
            }
        }

        function exportNovelAsMarkdown() {
            const selectedTitle = document.getElementById('selectedNovelTitle').value;

            if (!selectedTitle) {
                alert('Please select a novel title first.');
                return;
            }

            // Collect all chapter content
            const chapters = [];
            const chapterItems = document.querySelectorAll('.chapter-item');

            chapterItems.forEach((item, index) => {
                const chapterNumber = index + 1;
                const chapterTitle = item.querySelector('.chapter-number').textContent;
                const chapterContent = item.querySelector('.chapter-content');

                chapters.push({
                    number: chapterNumber,
                    title: chapterTitle,
                    content: chapterContent && chapterContent.style.display !== 'none' ?
                        chapterContent.textContent : '[Chapter content not generated yet]'
                });
            });

            // Create markdown content
            let markdown = \`# \${selectedTitle}\n\n\`;

            // Add synopsis if available
            const synopsisElement = document.querySelector('.content-display');
            if (synopsisElement) {
                const synopsis = synopsisElement.textContent || synopsisElement.innerText;
                markdown += \`## Synopsis\n\n\${synopsis}\n\n\`;
            }

            // Add chapters
            chapters.forEach(chapter => {
                markdown += \`## \${chapter.title}\n\n\${chapter.content}\n\n---\n\n\`;
            });

            // Create and download file
            const blob = new Blob([markdown], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = \`\${selectedTitle.replace(/[^a-z0-9]/g, '_').toLowerCase()}.md\`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        // Footer
        const footer = document.createElement('footer');
        footer.style.position = 'fixed';
        footer.style.bottom = '0';
        footer.style.left = '0';
        footer.style.right = '0';
        footer.style.background = 'rgba(0, 0, 0, 0.8)';
        footer.style.color = '#00d4ff';
        footer.style.textAlign = 'center';
        footer.style.padding = '10px';
        footer.style.fontSize = '12px';
        footer.style.borderTop = '1px solid rgba(0, 212, 255, 0.3)';
        footer.style.backdropFilter = 'blur(5px)';
        footer.style.zIndex = '1000';
        footer.style.pointerEvents = 'none';
        footer.innerHTML = 'Quill™ by <a href="https://azzar.netlify.app/porto" target="_blank" style="color: #00ff88; text-decoration: none; pointer-events: auto;">LilyOpenCMS</a>';
        document.body.appendChild(footer);

    </script>
</body>
</html>`;
}

export function generateSettingsPageHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quill™ - Settings</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
            color: #e0e0e0;
            min-height: 100vh;
            padding: 20px;
            padding-bottom: 50px; /* Space for footer */
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            position: relative;
        }

        .settings-link {
            position: absolute;
            top: 0;
            right: 0;
            color: #00d4ff;
            text-decoration: none;
            font-size: 16px;
            transition: color 0.3s ease;
        }

        .settings-link:hover {
            color: #00ff88;
        }

        .header h1 {
            font-size: 2.5rem;
            font-weight: 300;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #00d4ff, #00ff88);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .header p {
            font-size: 1.1rem;
            opacity: 0.8;
        }

        .nav {
            text-align: center;
            margin-bottom: 30px;
        }

        .nav a {
            color: #00d4ff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 8px;
            transition: all 0.3s ease;
        }

        .nav a:hover {
            background: rgba(0, 212, 255, 0.1);
        }

        .settings-container {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            padding: 30px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .settings-section {
            margin-bottom: 30px;
        }

        .settings-section h3 {
            color: #00ff88;
            margin-bottom: 15px;
            font-size: 1.3rem;
        }

        /* Mobile settings improvements */
        @media (max-width: 768px) {
            .settings-container {
                padding: 20px;
                border-radius: 15px;
            }

            .settings-section {
                margin-bottom: 25px;
            }

            .settings-section h3 {
                font-size: 1.2rem;
                margin-bottom: 12px;
            }
        }

        @media (max-width: 480px) {
            .settings-container {
                padding: 15px;
            }

            .settings-section h3 {
                font-size: 1.1rem;
            }
        }

        .form-group {
            margin-bottom: 20px;
        }

        .language-select {
            width: 100%;
            padding: 12px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: #fff;
            font-size: 16px;
            transition: all 0.3s ease;
        }

        .language-select:focus {
            outline: none;
            border-color: #00d4ff;
            box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #00d4ff;
        }

        input[type="password"], input[type="text"] {
            width: 100%;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: #e0e0e0;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        input:focus {
            outline: none;
            border-color: #00d4ff;
            box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
        }

        .save-btn {
            background: linear-gradient(45deg, #00d4ff, #00ff88);
            color: #0f0f0f;
            border: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
            margin-top: 20px;
        }

        .save-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
        }

        .save-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .remove-btn {
            background: linear-gradient(45deg, #ff4757, #ff3838);
            color: #ffffff;
            border: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
            margin-top: 20px;
        }

        .remove-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(255, 71, 87, 0.3);
        }

        .remove-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .status-message {
            margin-top: 15px;
            padding: 12px;
            border-radius: 8px;
            display: none;
        }

        .status-success {
            background: rgba(0, 255, 136, 0.1);
            border: 1px solid #00ff88;
            color: #00ff88;
        }

        .status-error {
            background: rgba(255, 0, 0, 0.1);
            border: 1px solid #ff6b6b;
            color: #ff6b6b;
        }

        .info-box {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            border-left: 4px solid #00d4ff;
        }

        .info-box h4 {
            color: #00d4ff;
            margin-bottom: 10px;
        }

        .info-box p {
            opacity: 0.8;
            line-height: 1.5;
        }

        /* Mobile info-box improvements */
        @media (max-width: 768px) {
            .info-box {
                padding: 15px;
            }
        }

        @media (max-width: 480px) {
            .info-box {
                padding: 12px;
            }
        }

        /* Modal/Popup Styles */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .modal-overlay.show {
            opacity: 1;
            visibility: visible;
        }

        .modal-content {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 240, 240, 0.95) 100%);
            border-radius: 20px;
            padding: 30px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transform: scale(0.9) translateY(20px);
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .modal-overlay.show .modal-content {
            transform: scale(1) translateY(0);
        }

        .modal-title {
            color: #1a1a1a;
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 15px;
            background: linear-gradient(45deg, #00d4ff, #00ff88);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .modal-message {
            color: #555;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
            font-weight: 400;
        }

        .modal-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .modal-btn {
            padding: 14px 28px;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 120px;
            position: relative;
            overflow: hidden;
        }

        .modal-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .modal-btn:hover::before {
            left: 100%;
        }

        .modal-btn-cancel {
            background: linear-gradient(45deg, #f8f9fa, #e9ecef);
            color: #6c757d;
            border: 2px solid #dee2e6;
        }

        .modal-btn-cancel:hover {
            background: linear-gradient(45deg, #e9ecef, #dee2e6);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(108, 117, 125, 0.2);
        }

        .modal-btn-confirm {
            background: linear-gradient(45deg, #ff4757, #ff3838);
            color: white;
            border: 2px solid rgba(255, 71, 87, 0.3);
        }

        .modal-btn-confirm:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(255, 71, 87, 0.4);
            background: linear-gradient(45deg, #ff3838, #ff2828);
        }

        /* Mobile responsiveness for modal */
        @media (max-width: 480px) {
            .modal-content {
                padding: 25px 20px;
                margin: 20px;
                max-width: none;
                width: calc(100vw - 40px);
            }

            .modal-title {
                font-size: 20px;
            }

            .modal-message {
                font-size: 15px;
                margin-bottom: 25px;
            }

            .modal-buttons {
                gap: 12px;
            }

            .modal-btn {
                padding: 12px 24px;
                font-size: 15px;
                min-width: 110px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Quill™ Settings</h1>
            <p id="settingsDescription">Configure your Quill writing assistant</p>
        </div>

        <div class="nav">
            <a href="/">← Back to Generator</a>
        </div>

        <div class="settings-container">
            <div class="settings-section">
                <h3>Language Settings</h3>

                <div class="form-group">
                    <label for="uiLanguage">Interface Language</label>
                    <select id="uiLanguage" class="language-select">
                        <option value="english">English</option>
                        <option value="indonesian">Bahasa Indonesia</option>
                    </select>
                    <small style="color: #888; display: block; margin-top: 5px;">Choose the language for the user interface</small>
                </div>
            </div>

            <div class="settings-section">
                <h3>Gemini AI Configuration</h3>

                <div class="info-box">
                    <h4>How to get your API key:</h4>
                    <p>1. Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: #00d4ff;">Google AI Studio</a><br>
                    2. Sign in with your Google account<br>
                    3. Create a new API key<br>
                    4. Copy the key and paste it below</p>
                </div>

                <form id="apiKeyForm">
                    <div class="form-group">
                        <label for="apiKey">Gemini API Key *</label>
                        <input type="password" id="apiKey" placeholder="" required>
                    </div>

                    <button type="submit" class="save-btn" id="saveBtn">
                        Save API Key
                    </button>
                    <button type="button" class="remove-btn" id="removeBtn">
                        Remove API Key
                    </button>
                </form>

                <div class="status-message" id="statusMessage"></div>
            </div>

            <!-- Modal for confirmations -->
            <div class="modal-overlay" id="confirmationModal">
                <div class="modal-content">
                    <h3 class="modal-title" id="modalTitle">Remove API Key</h3>
                    <p class="modal-message" id="modalMessage">Are you sure you want to remove your API key?</p>
                    <div class="modal-buttons">
                        <button class="modal-btn modal-btn-cancel" id="modalCancel"></button>
                        <button class="modal-btn modal-btn-confirm" id="modalConfirm"></button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const apiKeyForm = document.getElementById('apiKeyForm');
            const apiKeyInput = document.getElementById('apiKey');
            const saveBtn = document.getElementById('saveBtn');
            const removeBtn = document.getElementById('removeBtn');
            const statusMessage = document.getElementById('statusMessage');
            const languageSelect = document.getElementById('uiLanguage');
            const modal = document.getElementById('confirmationModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalMessage = document.getElementById('modalMessage');
            const modalCancel = document.getElementById('modalCancel');
            const modalConfirm = document.getElementById('modalConfirm');

            // Language strings
            const languages = {
                english: {
                    navBack: '← Back to Generator',
                    title: 'Quill™ Settings',
                    settingsDescription: 'Configure your Quill writing assistant',
                    languageTitle: 'Language Settings',
                    languageLabel: 'Interface Language',
                    languageHelp: 'Choose the language for the user interface',
                    apiTitle: 'Gemini AI Configuration',
                    apiInstructions: 'How to get your API key:',
                    apiSteps: ['<a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: #00d4ff; text-decoration: underline;">Go to Google AI Studio</a>', 'Sign in with your Google account', 'Create a new API key', 'Copy the key and paste it below'],
                    apiKeyLabel: 'Gemini API Key *',
                    apiKeyPlaceholder: 'Enter your Gemini API key',
                    saveButton: 'Save API Key',
                    removeButton: 'Remove API Key',
                    removeConfirmTitle: 'Remove API Key',
                    removeConfirmMessage: 'Are you sure you want to remove the API key?',
                    cancelButton: 'Cancel',
                    removeModalButton: 'Remove',
                    apiKeySaved: 'API key saved successfully!',
                    apiKeyVerified: 'API key verified and saved successfully!',
                    apiKeyVerificationFailed: 'API key saved but verification failed: ',
                    apiKeySaveError: 'API key saved but could not verify: ',
                    pleaseEnterApiKey: 'Please enter an API key'
                },
                indonesian: {
                    navBack: '← Kembali ke Generator',
                    title: 'Pengaturan Quill™',
                    settingsDescription: 'Konfigurasikan asisten penulisan Quill Anda',
                    languageTitle: 'Pengaturan Bahasa',
                    languageLabel: 'Bahasa Antarmuka',
                    languageHelp: 'Pilih bahasa untuk antarmuka pengguna',
                    apiTitle: 'Konfigurasi Gemini AI',
                    apiInstructions: 'Cara mendapatkan kunci API:',
                    apiSteps: ['<a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: #00d4ff; text-decoration: underline;">Kunjungi Google AI Studio</a>', 'Masuk dengan akun Google Anda', 'Buat kunci API baru', 'Salin kunci dan tempel di bawah'],
                    apiKeyLabel: 'Kunci API Gemini *',
                    apiKeyPlaceholder: 'Masukkan kunci API Gemini Anda',
                    saveButton: 'Simpan Kunci API',
                    removeButton: 'Hapus Kunci API',
                    removeConfirmTitle: 'Hapus Kunci API',
                    removeConfirmMessage: 'Apakah Anda yakin ingin menghapus kunci API?',
                    cancelButton: 'Batal',
                    removeModalButton: 'Hapus',
                    apiKeySaved: 'Kunci API berhasil disimpan!',
                    apiKeyVerified: 'Kunci API diverifikasi dan berhasil disimpan!',
                    apiKeyVerificationFailed: 'Kunci API disimpan tetapi verifikasi gagal: ',
                    apiKeySaveError: 'Kunci API disimpan tetapi tidak dapat diverifikasi: ',
                    pleaseEnterApiKey: 'Silakan masukkan kunci API'
                }
            };

            // Load saved language preference
            const savedLanguage = localStorage.getItem('uiLanguage') || 'english';
            languageSelect.value = savedLanguage;

            // Modal functionality
            function showModal(title, message, onConfirm, cancelText = 'Cancel', confirmText = 'Confirm') {
                modalTitle.textContent = title;
                modalMessage.textContent = message;
                modalCancel.textContent = cancelText;
                modalConfirm.textContent = confirmText;
                modal.classList.add('show');

                function closeModal() {
                    modal.classList.remove('show');
                }

                modalCancel.onclick = closeModal;

                modalConfirm.onclick = function() {
                    closeModal();
                    onConfirm();
                };

                // Close on overlay click
                modal.onclick = function(e) {
                    if (e.target === modal) {
                        closeModal();
                    }
                };

                // Close on Escape key
                document.addEventListener('keydown', function escHandler(e) {
                    if (e.key === 'Escape') {
                        closeModal();
                        document.removeEventListener('keydown', escHandler);
                    }
                });
            }

            // Load saved API key
            const savedApiKey = localStorage.getItem('geminiApiKey');
            if (savedApiKey) {
                apiKeyInput.value = savedApiKey;
                // Show remove button if API key exists
                removeBtn.style.display = 'inline-block';
            } else {
                removeBtn.style.display = 'none';
            }

            // Remove API key functionality
            removeBtn.addEventListener('click', function() {
                const currentLang = localStorage.getItem('uiLanguage') || 'english';
                const texts = languages[currentLang];

                showModal(texts.removeConfirmTitle, texts.removeConfirmMessage, function() {
                    localStorage.removeItem('geminiApiKey');
                    apiKeyInput.value = '';
                    removeBtn.style.display = 'none';
                    showStatus(texts.apiKeyRemoved || 'API key removed successfully.', 'success');
                }, texts.cancelButton || 'Cancel', texts.removeModalButton || 'Remove');
            });

            // Function to update UI language
            function updateLanguage(lang) {
                const texts = languages[lang];
                document.querySelector('.nav a').textContent = texts.navBack;
                document.querySelector('h1').textContent = texts.title;
                document.querySelector('#settingsDescription').textContent = texts.settingsDescription;
                document.querySelectorAll('.settings-section h3')[0].textContent = texts.languageTitle;
                document.querySelector('label[for="uiLanguage"]').textContent = texts.languageLabel;
                document.querySelector('.settings-section small').textContent = texts.languageHelp;
                document.querySelectorAll('.settings-section h3')[1].textContent = texts.apiTitle;
                document.querySelector('.info-box h4').textContent = texts.apiInstructions;
                const steps = document.querySelector('.info-box p');
                steps.innerHTML = texts.apiSteps.map((step, index) => (index + 1) + '. ' + step).join('<br>');
                document.querySelector('label[for="apiKey"]').textContent = texts.apiKeyLabel;
                apiKeyInput.placeholder = texts.apiKeyPlaceholder;
                saveBtn.textContent = texts.saveButton;

                // Store language preference
                localStorage.setItem('uiLanguage', lang);
            }

            // Initialize language
            updateLanguage(savedLanguage);

            // Handle language change
            languageSelect.addEventListener('change', function() {
                updateLanguage(this.value);
            });

            // Remove API key functionality
            removeBtn.addEventListener('click', function() {
                const currentLang = localStorage.getItem('uiLanguage') || 'english';
                const texts = languages[currentLang];

                showModal(texts.removeConfirmTitle, texts.removeConfirmMessage, function() {
                    localStorage.removeItem('geminiApiKey');
                    apiKeyInput.value = '';
                    removeBtn.style.display = 'none';
                    showStatus(texts.apiKeyRemoved || 'API key removed successfully.', 'success');
                }, texts.cancelButton || 'Cancel', texts.removeModalButton || 'Remove');
            });

            // Save API key
            apiKeyForm.addEventListener('submit', async function(e) {
                e.preventDefault();

                const currentLang = localStorage.getItem('uiLanguage') || 'english';
                const texts = languages[currentLang];

                const apiKey = apiKeyInput.value.trim();
                if (!apiKey) {
                    showStatus(texts.pleaseEnterApiKey, 'error');
                    return;
                }

                // Save to localStorage
                localStorage.setItem('geminiApiKey', apiKey);
                showStatus(texts.apiKeySaved, 'success');

                // Show remove button
                removeBtn.style.display = 'inline-block';
                removeBtn.textContent = texts.removeButton;

                // Test the API key
                try {
                    const response = await fetch('/api/test-key', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ apiKey })
                    });

                    if (response.ok) {
                        showStatus(texts.apiKeyVerified, 'success');
                    } else {
                        const result = await response.json();
                        let errorMessage = result.error || 'Unknown error';

                        // Provide more user-friendly error messages
                        if (errorMessage.includes('quota exceeded') || errorMessage.includes('429')) {
                            errorMessage = texts.apiKeyQuotaExceeded;
                        } else if (errorMessage.includes('403') || errorMessage.includes('access denied') || errorMessage.includes('unauthorized')) {
                            errorMessage = texts.apiKeyInvalid;
                        }

                        showStatus(texts.apiKeyVerificationFailed + errorMessage, 'error');
                    }
                } catch (error) {
                    let errorMessage = error.message;

                    // Provide more user-friendly error messages for network issues
                    if (error.message.includes('network') || error.message.includes('fetch')) {
                        errorMessage = texts.networkError;
                    }

                    showStatus(texts.apiKeySaveError + errorMessage, 'error');
                }
            });

            function showStatus(message, type) {
                statusMessage.textContent = message;
                statusMessage.className = 'status-message status-' + type;
                statusMessage.style.display = 'block';

                setTimeout(() => {
                    statusMessage.style.display = 'none';
                }, 5000);
            }
        });

        // Footer
        const footer = document.createElement('footer');
        footer.style.position = 'fixed';
        footer.style.bottom = '0';
        footer.style.left = '0';
        footer.style.right = '0';
        footer.style.background = 'rgba(0, 0, 0, 0.8)';
        footer.style.color = '#00d4ff';
        footer.style.textAlign = 'center';
        footer.style.padding = '10px';
        footer.style.fontSize = '12px';
        footer.style.borderTop = '1px solid rgba(0, 212, 255, 0.3)';
        footer.style.backdropFilter = 'blur(5px)';
        footer.style.zIndex = '1000';
        footer.style.pointerEvents = 'none';
        footer.innerHTML = 'Quill™ by <a href="https://azzar.netlify.app/porto" target="_blank" style="color: #00ff88; text-decoration: none; pointer-events: auto;">LilyOpenCMS</a>';
        document.body.appendChild(footer);

    </script>
</body>
</html>`;
}
