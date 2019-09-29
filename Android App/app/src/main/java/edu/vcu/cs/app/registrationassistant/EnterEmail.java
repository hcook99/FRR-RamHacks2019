package edu.vcu.cs.app.registrationassistant;

import androidx.appcompat.app.AppCompatActivity;
import android.view.View.OnClickListener;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;

public class EnterEmail extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_enter_email);


        ImageButton buttonUnlock = (ImageButton) findViewById(R.id.loginButton);
        buttonUnlock.setOnClickListener(new View.OnClickListener() {

            @Override
            //on click of buttonUnlock event- an intent
            public void onClick(View view) {
                //second thing is what youre making,
                Intent unlockIntent = new Intent(getApplicationContext(), DayView.class);
                startActivity(unlockIntent);

            }
        });

    }
}
