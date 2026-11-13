CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/dsyrk

$(BIN):
	mkdir -p $(BIN)

$(BIN)/dsyrk: dsyrk.c $(HDRS) | $(BIN)
	$(CC) dsyrk.c -o $(BIN)/dsyrk -lcublas

clean:
	rm -rf $(BIN)
