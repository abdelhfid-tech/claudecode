package org.isnadgame.isnad;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

/* ISNAD — l'activité de l'application (Capacitor). Plein écran : les barres du système sont cachées ; un glissement depuis
   le bord les fait paraître un instant par-dessus le jeu, puis elles se retirent d'elles-mêmes. L'encoche reste hors du
   jeu : le greffon SystemBars de Capacitor donne ses marges à la WebView (env(safe-area-inset-*) quand la WebView le sait,
   sinon une marge de la vue). Les deux orientations : rien ne les fixe dans le manifeste. */
public class MainActivity extends BridgeActivity {
    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) pleinEcran();
    }

    private void pleinEcran() {
        WindowInsetsControllerCompat barres = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        barres.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
        barres.hide(WindowInsetsCompat.Type.systemBars());
    }
}
