const { Builder, By, Key, until } = require("selenium-webdriver");

require("dotenv").config();
const { BASE_URL, MAIL_ADDRESS, PASSWORD } = process.env;

// 一定時間停止する
const sleep = async (time) => {
    await new Promise((resolve) => setTimeout(resolve, time));
};

// 全ての読み込みを待つ
const fullyLoaded = async (driver) => {
    await driver.wait(async () => {
        const readyState = await driver.executeScript(
            "return document.readyState"
        );
        return readyState === "complete";
    }, 10000);
};

// メインの処理
const main = async () => {
    // Chromeブラウザを立ち上げる
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        // 指定したURLにアクセス
        await driver.get(BASE_URL);
        await fullyLoaded(driver);

        // メールアドレス入力画面
        const mailInput = await driver.findElement(By.id("domain"));
        const mailSendButton = await driver.findElement(
            By.css('[data-qa="submit_team_domain_button"]')
        );
        await mailInput.sendKeys("lvgs");
        await mailSendButton.click();
        await fullyLoaded(driver);

        // Googleでサインインをクリック
        const googleSignInButton = await driver.findElement(
            By.id("index_google_sign_in_with_google")
        );
        await googleSignInButton.click();
        await fullyLoaded(driver);

        // メールアドレスを入力
        const googleMailInput = await driver.findElement(By.id("identifierId"));
        const googleNextButton = await driver.findElement(
            By.css(
                '[data-idom-class="nCP5yc AjY5Oe DuMIQc LQeN7 BqKGqe Jskylb TrZEUc lw1w4b"]'
            )
        );
        await googleMailInput.sendKeys(MAIL_ADDRESS);
        await googleNextButton.click();
        await sleep(3000);

        // パスワードを入力
        const googlePassInput = await driver.findElement(
            By.className("whsOnd zHQkBf")
        );
        const googleNextButton2 = await driver.findElement(
            By.css(
                '[data-idom-class="nCP5yc AjY5Oe DuMIQc LQeN7 BqKGqe Jskylb TrZEUc lw1w4b"]'
            )
        );
        await googlePassInput.sendKeys(PASSWORD);
        await googleNextButton2.click();

        // 新規メッセージを選択する
        const newMessageButton = await driver.wait(
            until.elementLocated(
                By.className(
                    "c-button-unstyled c-icon_button c-icon_button--size_medium p-home_header_controls__composer_button c-icon_button--default"
                )
            ),
            10000
        );
        await newMessageButton.click();
        const sendInput = await driver.wait(
            until.elementLocated(
                By.className("c-multi_select_input__filter_query")
            ),
            10000
        );
        await sendInput.sendKeys(MAIL_ADDRESS);
        await sleep(500);
        await sendInput.sendKeys(Key.ENTER);

        // メッセージを入力
    } catch (error) {
        console.error(error);
    } finally {
        // ブラウザを閉じる（必要に応じて)
        await sleep(1000);
        //await driver.quit();
    }
};

main();
