# CASE

CASE is a simple electron app to generate TOTP as 2-factor authontication.

## Installation

* Clone the repo
* Run `yarn install`
* Run `yarn build:mac`
* It creates app in dist directory
* Install the app `case-1.0.0.dmg`

Note: for any build issues, refer electron doc: https://www.electronjs.org/docs/latest/development/build-instructions-macos

## Register an app with token

* Launch the app
* It should create icon (egg) on the tray (top right)
* Click the icon and select register
* Input App name and token

App name appears in the same menu. Click to copy the TOTP to clip board and paste it anywhere.

There you go. All done.

## Unregister an app

* Click unregister from the tray menu
* Input name of the app (name should match with registerd apps and case sensitive)
* Click ok. All done.

## License (MIT)

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.




