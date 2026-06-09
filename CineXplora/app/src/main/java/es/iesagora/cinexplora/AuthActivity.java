package es.iesagora.cinexplora;

import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import es.iesagora.cinexplora.databinding.ActivityAuthBinding;
import es.iesagora.cinexplora.databinding.ActivityMainBinding;

public class AuthActivity extends AppCompatActivity {

    ActivityAuthBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView((binding = ActivityAuthBinding.inflate(getLayoutInflater())).getRoot());


    }
}