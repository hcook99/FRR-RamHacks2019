package edu.vcu.cs.app.registrationassistant;


import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;

public class MainActivity extends AppCompatActivity {

    private static final int SPLASH_DISPLAY_TIME = 2500;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        new Handler().postDelayed(new Runnable() {
            public void run() {

                Intent intent = new Intent();
                intent.setClass(MainActivity.this,
                        MainActivity.class);

                MainActivity.this.startActivity(intent);
                MainActivity.this.finish();

                Intent enterEmail = new Intent(MainActivity.this,EnterEmail.class);
                startActivity(enterEmail);

            }
        }, SPLASH_DISPLAY_TIME);
    }
}









