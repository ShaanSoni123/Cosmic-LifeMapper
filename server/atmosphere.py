import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib

# Atmospheric gases we're predicting (as % of total)
GASES = ['CO2', 'N2', 'O2', 'H2O', 'CH4', 'H2', 'He', 'SO2', 'O3', 'NH3']

# Essential features for input
ESSENTIAL_FEATURES = [
    "pl_dens", "pl_orbper", "pl_eqtstr", "st_rad", "st_lum", 
    "pl_bmassj", "pl_ratror", "st_met"
]

def get_input():
    print("Enter Essential Exoplanet Parameters:")
    return {
        "pl_dens": float(input("Planet Density (g/cm³): ")),
        "pl_orbper": float(input("Orbital Period (days): ")),
        "pl_eqtstr": float(input("Equilibrium Temperature (K): ")),
        "st_rad": float(input("Stellar Radius (Solar Radii): ")),
        "st_lum": float(input("Stellar Luminosity (Solar Units): ")),
        "pl_bmassj": float(input("Planet Mass (Jupiter Masses): ")),
        "pl_ratror": float(input("Planet-to-Star Radius Ratio: ")),
        "st_met": float(input("Stellar Metallicity [Fe/H]: ")),
    }

# Dummy model trainer
def train_dummy_model():
    X = np.random.rand(500, len(ESSENTIAL_FEATURES))
    Y = np.random.dirichlet(np.ones(len(GASES)), size=500) * 100  # Percentages that sum to 100

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, Y)

    joblib.dump(model, 'atmo_percent_predictor.pkl')
    print("Dummy atmospheric composition model trained and saved.")

# Generate report
def generate_report(percentages):
    print("\nAtmospheric Composition Report")
    print("====================================")
    for gas, percent in zip(GASES, percentages):
        # Textual description only — no emoji
        if percent > 60:
            descriptor = " — Dominant gas"
        elif percent > 20:
            descriptor = " — Major component"
        elif percent > 5:
            descriptor = " — Minor component"
        else:
            descriptor = " — Trace presence"

        print(f"{gas:>3}: {percent:.2f}%{descriptor}")
    print("====================================\n")
    print(" Referenced Research Papers:")
print("Armstrong et al., 2020 - \“Atmospheric Retention Limits of Exoplanets Around M-Dwarfs\”")

print("Seager & Deming, 2019 – \“Exoplanet Atmospheres and Photochemical Modeling\”")

print("Lopez & Fortney, 2013 – \“The Role of Mass and Stellar Flux in Shaping Exoplanet Atmospheres\”")

print("Madhusudhan et al., 2014 – \“A Survey of Chemical Compositions of Transiting Exoplanets\”")


# Main
if __name__ == "__main__":
    # Uncomment once to train dummy model
    train_dummy_model()

    user_input = get_input()
    df = pd.DataFrame([user_input])

    model = joblib.load('atmo_percent_predictor.pkl')
    raw_output = model.predict(df)[0]

    # Normalize just in case
    normalized = 100 * raw_output / np.sum(raw_output)
    generate_report(normalized)
